package com.chacha.biz.busReservation.controller;

import com.chacha.biz.busReservation.dto.BusReservationDTO;
import com.chacha.biz.busReservation.entity.BusReservationEntity;
import com.chacha.biz.busReservation.repository.BusReservationRepository;
import com.chacha.biz.busReservation.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final BusReservationRepository busReservationRepository;

    @GetMapping(value = "/connection/{bus_no}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter emitterConnect(@PathVariable String bus_no){
        //버스 번호로 연결
        return notificationService.BusReservation(bus_no);
    }

    @PostMapping(value = "/reservation")
    public ResponseEntity BusReservation(@RequestBody BusReservationDTO reservationDTO) throws Exception {

        BusReservationEntity reservation = BusReservationEntity.builder()
                .person_Type(reservationDTO.getPerson_Type())
                .in_Stop_NM(reservationDTO.getIn_Stop_NM())
                .bus_No(reservationDTO.getBus_No())
                .out_Stop_NM(reservationDTO.getOut_Stop_NM())
                .build();
        Long userId = busReservationRepository.save(reservation).getReservation_Id();

        BusReservationEntity busReservation = busReservationRepository.getReferenceById(userId);
        notificationService.notify(reservationDTO.getBus_No(), busReservation);

        return new ResponseEntity<>(busReservation, HttpStatus.OK);
    }
}
