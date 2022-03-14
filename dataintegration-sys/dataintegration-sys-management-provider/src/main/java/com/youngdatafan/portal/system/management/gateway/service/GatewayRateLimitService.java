package com.youngdatafan.portal.system.management.gateway.service;

import com.datafan.dataintegration.core.util.JsonUtils;
import com.youngdatafan.portal.system.management.gateway.MsgType;
import com.youngdatafan.portal.system.management.gateway.dto.DpGatewayRateLimitDTO;
import com.youngdatafan.portal.system.management.gateway.dto.DpGatewayRateLimitMsgDTO;
import com.youngdatafan.portal.system.management.gateway.entity.DpGatewayRatelimit;
import com.youngdatafan.portal.system.management.gateway.mapper.DpGatewayRatelimitMapper;
import com.youngdatafan.portal.system.management.gateway.vo.DpGatewayRateLimitVO;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class GatewayRateLimitService {
    private static final Logger log = LoggerFactory.getLogger(GatewayRouteService.class);

    private final DpGatewayRatelimitMapper dpGatewayRatelimitMapper;
    private final RedisPublisherService redisPublisherService;

    @Value("${gateway.ratelimit.channel:gateway_ratelimit}")
    private String gatewayRateLimitChannel;

    @Autowired
    public GatewayRateLimitService(DpGatewayRatelimitMapper dpGatewayRatelimitMapper, RedisPublisherService redisPublisherService) {
        this.dpGatewayRatelimitMapper = dpGatewayRatelimitMapper;
        this.redisPublisherService = redisPublisherService;
    }

    /**
     * 增加或者更新规则
     *
     * @param dpGatewayRateLimitVO DpGatewayRateLimitVO
     */
    public DpGatewayRateLimitDTO upsert(DpGatewayRateLimitVO dpGatewayRateLimitVO) {
        DpGatewayRatelimit record = new DpGatewayRatelimit();
        BeanUtils.copyProperties(dpGatewayRateLimitVO, record);

        if (dpGatewayRatelimitMapper.selectByResource(dpGatewayRateLimitVO.getResource()) != null) {
            record.setUpdateTime(new Date());
            record.setStatus(1);
            dpGatewayRatelimitMapper.updateByPrimaryKeySelective(record);
        } else {
            record.setId(RandomStringUtils.randomAlphabetic(32));
            record.setCreateTime(new Date());
            record.setStatus(1);
            dpGatewayRatelimitMapper.insert(record);
        }

        final DpGatewayRateLimitDTO result = new DpGatewayRateLimitDTO();
        BeanUtils.copyProperties(record, result);

        // 发送redis消息
        redisPublisherService.pubMsg(gatewayRateLimitChannel
                , JsonUtils.toString(new DpGatewayRateLimitMsgDTO(MsgType.UPSET, result)));

        return result;
    }

    public int deleteByPrimaryKey(String id) {
        final DpGatewayRatelimit dpGatewayRatelimit = dpGatewayRatelimitMapper.selectByPrimaryKey(id);
        if (dpGatewayRatelimit == null) {
            return 0;
        }

        final int i = dpGatewayRatelimitMapper.deleteByPrimaryKey(id);
        // 获取resource
        DpGatewayRateLimitDTO dpGatewayRateLimitDTO = new DpGatewayRateLimitDTO();
        dpGatewayRateLimitDTO.setResource(dpGatewayRatelimit.getResource());
        dpGatewayRateLimitDTO.setStatus(1);

        // 发送redis消息
        redisPublisherService.pubMsg(gatewayRateLimitChannel
                , JsonUtils.toString(new DpGatewayRateLimitMsgDTO(MsgType.DELETE, dpGatewayRateLimitDTO)));
        return i;
    }

    public List<DpGatewayRateLimitDTO> selectAll() {
        return dpGatewayRatelimitMapper.selectAll();
    }

}