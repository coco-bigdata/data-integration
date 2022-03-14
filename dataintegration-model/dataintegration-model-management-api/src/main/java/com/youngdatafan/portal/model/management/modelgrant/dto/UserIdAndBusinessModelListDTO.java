package com.youngdatafan.portal.model.management.modelgrant.dto;

import java.util.List;

/**
 * <p>****************************************************************************</p>
 * <ul style="margin:15px;">
 * <li>Description : description</li>
 * <li>Version     : 1.0</li>
 * <li>Creation    : 2020/2/25 10:14 PM</li>
 * <li>Author      : ksice_xt</li>
 * </ul>
 * <p>****************************************************************************</p>
 */
public class UserIdAndBusinessModelListDTO {
    private String userId;

    private List<BusinessModelListDTO> listDTOS;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<BusinessModelListDTO> getListDTOS() {
        return listDTOS;
    }

    public void setListDTOS(List<BusinessModelListDTO> listDTOS) {
        this.listDTOS = listDTOS;
    }

    @Override
    public String toString() {
        return "UserIdAndBusinessModelListDTO{" +
                "userId='" + userId + '\'' +
                ", listDTOS=" + listDTOS +
                '}';
    }
}