package com.chacha.biz.impl;

import com.chacha.biz.dto.BusStationDTO;
import com.chacha.biz.mapper.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("busService")
public class BusServiceImpl {

    private final BusService busDAO;

    @Autowired
    public BusServiceImpl(BusService busDAO) {
        this.busDAO = busDAO;
    }

    public List<BusStationDTO> getAll() {
        return busDAO.getAll();
    }
    public void insertBusStation(BusStationDTO dto) {
        busDAO.insertBusStation(dto);
    }


}
