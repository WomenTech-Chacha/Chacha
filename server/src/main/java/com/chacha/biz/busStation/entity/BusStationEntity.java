package com.chacha.biz.busStation.entity;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@NoArgsConstructor
@Entity(name="BUS_STATION")
@Getter
public class BusStationEntity {

    @Id
    private int STOP_NO; //int
    @Column(length = 1000)
    private String STOP_NM;
    private BigDecimal XCODE; //Float
    private BigDecimal YCODE; //Float
    private int NODE_ID; //int
    @Column(length = 1000)
    private String STOP_TYPE;

    @Builder
    public BusStationEntity(int STOP_NO, String STOP_NM, BigDecimal XCODE, BigDecimal YCODE, int NODE_ID, String STOP_TYPE){
        this.STOP_NO = STOP_NO;
        this.STOP_NM = STOP_NM;
        this.XCODE = XCODE;
        this.YCODE = YCODE;
        this.NODE_ID = NODE_ID;
        this.STOP_TYPE = STOP_TYPE;
    }

}
