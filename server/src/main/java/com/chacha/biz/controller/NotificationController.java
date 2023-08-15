package com.chacha.biz.controller;

import com.chacha.biz.busReservation.BusReservationDTO;
import com.chacha.biz.busReservation.BusReservationEntity;
import com.chacha.biz.busReservation.BusReservationRepository;
import com.chacha.biz.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final BusReservationRepository busReservationRepository;
    //아직 구현 중
    //produces = "text/event-stream"
    @GetMapping(value = "/connection", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter emitterConnect(int bus_no){
        //버스 번호로 연결
        return notificationService.BusReservation(bus_no);
    }

    @PostMapping(value = "/reservation")
    public ResponseEntity BusReservation(@RequestBody BusReservationDTO reservationDTO){
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        //System.out.println(now.format(dtf));

        BusReservationEntity reservation = BusReservationEntity.builder()
                .person_Type(reservationDTO.getPerson_Type())
                .in_Stop_NM(reservationDTO.getIn_Stop_No())
                .bus_No(reservationDTO.getBus_No())
                .out_Stop_NM(reservationDTO.getOut_Stop_No())
                .build();
        Long userId = busReservationRepository.save(reservation).getReservation_Id();

        Optional<BusReservationEntity> busReservation = busReservationRepository.findById(userId);
        notificationService.notify(reservationDTO.getBus_No(), busReservation);
        
        //추가확인필요
        return new ResponseEntity<>("알림보내기",HttpStatus.OK);
    }
}
