package com.chacha.biz;

import com.chacha.biz.busStation.entity.BusStationEntity;
import com.chacha.biz.busStation.repository.BusStationRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BusStationRepositoryTest {
    @Autowired
    BusStationRepository busStationRepository;

    @Test
    public void 버스정류장_불러오기(){
        List<BusStationEntity> list = busStationRepository.findAll();
    }
}
