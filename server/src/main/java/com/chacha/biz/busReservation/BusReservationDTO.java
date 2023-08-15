package com.chacha.biz.busReservation;

import lombok.Data;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Data
public class BusReservationDTO {
    private Long reservation_Id;
    private String person_Type;
    private Date ride_Date;
    private String in_Stop_No;
    private int bus_No;
    private String out_Stop_No;
}
