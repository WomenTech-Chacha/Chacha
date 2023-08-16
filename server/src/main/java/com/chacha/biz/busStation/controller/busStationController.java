package com.chacha.biz.busStation.controller;

import com.chacha.biz.busStation.dto.BusStationDTO;
import com.chacha.biz.busStation.entity.BusStationEntity;
import com.chacha.biz.busStation.repository.BusStationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class busStationController {
    private final BusStationRepository busStationRepository;

    @GetMapping("/busStationMap")
    public ResponseEntity getBusStations(Model model) throws Exception {
        List<BusStationEntity> busEntity = busStationRepository.findAll();
        List<BusStationDTO> busList = new ArrayList<>();
        for(BusStationEntity bus : busEntity){
            BusStationDTO busDTO = new BusStationDTO();
            busDTO.setSTOP_NO(String.valueOf(bus.getSTOP_NO()));
            busDTO.setSTOP_NM(bus.getSTOP_NM());
            busDTO.setXCODE(String.valueOf(bus.getXCODE()));
            busDTO.setYCODE(String.valueOf(bus.getYCODE()));
            busDTO.setNODE_ID(String.valueOf(bus.getNODE_ID()));
            busDTO.setSTOP_TYPE(bus.getSTOP_TYPE());

            busList.add(busDTO);
        }
        model.addAttribute("busStations", busList);

        return new ResponseEntity<>(model, HttpStatus.OK);
    }
}
