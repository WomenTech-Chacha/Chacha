package com.chacha.biz.busReservation.dto;

import lombok.Data;
import java.util.Date;

@Data
public class BusReservationDTO {
    private Long reservation_Id;
    private String person_Type;
    private Date ride_Date;
    private String in_Stop_NM;
    private String bus_No;
    private String out_Stop_NM;
}
