package com.chacha.biz.controller;

import com.chacha.biz.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    //아직 구현 중
    //produces = "text/event-stream"
    @GetMapping(value = "/reservation", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter BusReservation(){

        return notificationService.BusReservation();
    }
}
