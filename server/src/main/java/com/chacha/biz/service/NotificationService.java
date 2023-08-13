package com.chacha.biz.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final Long DEFAULT_TIMEOUT = 60L*1000*60;
    //아직 구현 중
    //사용자가 승차 예약을 하면 기사에게 알림
    //전송할 정보를 담을 dto 만들기
    public SseEmitter BusReservation(){
        SseEmitter emitter = new SseEmitter();
        try{
            emitter.send(SseEmitter.event()
                    .name("connect"));
        }catch (IOException e){
            e.printStackTrace();
        }

        return emitter;
    }

}
