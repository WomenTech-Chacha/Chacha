package com.chacha.biz.controller;

import com.chacha.biz.BusStationExplorer;
import com.chacha.biz.dto.BusStationDTO;
import com.chacha.biz.impl.BusServiceImpl;
import com.chacha.biz.mapper.BusService;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
public class HelloController {
    private final BusService busService;
    @Autowired
    public HelloController(BusService busService) {
        this.busService = busService;
    }

    //리액트 연동 테스트
    @GetMapping("/test")
    public String hello(){
        return "서버포트는 8081, 리액트 포트는 3000";
    }

    @GetMapping("/busStationMap")
    public ResponseEntity getBusStations(Model model) throws Exception {
        //System.out.println(busService.getAll().toString());
        model.addAttribute("busStations",busService.getAll());

        return new ResponseEntity<>(model, HttpStatus.OK);
    }
   /* @GetMapping("/insertBus")
    public String insertBus() throws IOException, ParserConfigurationException, SAXException, ParseException {
        BusStationExplorer busExplorer = new BusStationExplorer();
        List<BusStationDTO> list = new ArrayList<>();
        list = busExplorer.parsingData();
        for (BusStationDTO dto : list) {
            busService.insertBusStation(dto);
        }
        return "test";
    }*/
}
