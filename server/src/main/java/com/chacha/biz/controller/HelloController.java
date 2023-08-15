package com.chacha.biz.controller;

import com.chacha.biz.busStation.BusStationEntity;
import com.chacha.biz.busStation.BusStationRepository;
import com.chacha.biz.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class HelloController {
    //BusService
    private final BusService busService;
    private final BusStationRepository busStationRepository;
    //@Autowired
    //public HelloController(BusService busService) {
    //   this.busService = busService;
    //}

    @GetMapping("/busStationMap")
    public ResponseEntity getBusStations(Model model) throws Exception {
        //System.out.println(busService.getAll().toString());
        //model.addAttribute("busStations",busService.getAll());

        Optional<BusStationEntity> bus = busStationRepository.findById(1001);
        model.addAttribute("busStations",busStationRepository.findAll());
        //System.out.println(bus.get());
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
