package com.chacha.biz.controller;

import com.chacha.biz.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class HelloController {
    //BusService
    private final BusService busService;
    //@Autowired
    //public HelloController(BusService busService) {
    //   this.busService = busService;
    //}

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
