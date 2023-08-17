package com.chacha.biz.busReservation.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor
@Entity(name="bus_reservation")
@Getter
public class BusReservationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservation_Id;
    private String person_Type;
    @CreationTimestamp
    private LocalDateTime ride_Date;
    private String in_Stop_NM;
    private int bus_No;
    private String out_Stop_NM;

    @Builder
    public BusReservationEntity(Long reservation_Id, String person_Type, LocalDateTime ride_Date, String in_Stop_NM, int bus_No, String out_Stop_NM){
        this.reservation_Id = reservation_Id;
        this.person_Type = person_Type;
        this.ride_Date = ride_Date;
        this.in_Stop_NM = in_Stop_NM;
        this.bus_No = bus_No;
        this.out_Stop_NM = out_Stop_NM;
    }

}
