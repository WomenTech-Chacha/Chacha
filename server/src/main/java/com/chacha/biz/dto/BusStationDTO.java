package com.chacha.biz.dto;

import lombok.Data;

@Data
public class BusStationDTO {
    private String STOP_NO; //int
    private String STOP_NM;
    private String XCODE; //Float
    private String YCODE; //Float
    private String NODE_ID; //int
    private String STOP_TYPE;

}
