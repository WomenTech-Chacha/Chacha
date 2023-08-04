package com.chacha.biz.dto;

import lombok.Data;

@Data
public class BusStationDTO {
    private int STOP_NO;
    private String STOP_NM;
    private Float XCODE;
    private Float YCODE;
    private int NODE_ID;
    private String STOP_TYPE;

}
