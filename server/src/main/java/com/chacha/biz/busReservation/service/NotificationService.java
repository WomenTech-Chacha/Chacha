package com.chacha.biz.busReservation.service;

import com.chacha.biz.busReservation.repository.EmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final EmitterRepository emitterRepository;

    public SseEmitter BusReservation(int id){
        SseEmitter emitter = createEmitter(id);
        sendToClient(id, "SseEmitter Created. user_ID= "+id);
        return emitter;
    }

    //서버의 이벤트를 클라이언트한테 보내는 메서드
    public void notify(int userId, Object event) {
        sendToClient(userId, event);
    }

    //이벤트 Emitter 생성
    private SseEmitter createEmitter(int id) {
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(id, emitter);

        // Emitter가 완료될 때(모든 데이터가 성공적으로 전송된 상태) Emitter를 삭제한다.
        emitter.onCompletion(() -> emitterRepository.deleteById(id));
        // Emitter가 타임아웃 되었을 때(지정된 시간동안 어떠한 이벤트도 전송되지 않았을 때) Emitter를 삭제한다.
        emitter.onTimeout(() -> emitterRepository.deleteById(id));

        return emitter;
    }

    //클라이언트에게 데이터 전송
    private void sendToClient(int id, Object data) {
        SseEmitter emitter = emitterRepository.get(id);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .id(String.valueOf(id))
                        .name("SseEmitter")
                        .data(data));
            } catch (IOException exception) {
                emitterRepository.deleteById(id);
                emitter.completeWithError(exception);
            }
        }
    }


}
