package com.chacha.biz.service;

import com.chacha.biz.dao.BusDAO;
import com.chacha.biz.dto.BusStationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//
@Service("busService")
public class BusService {

    //private final BusService busDAO;
    private final BusDAO busDAO;

    @Autowired
    public BusService(BusDAO busDAO) {
        this.busDAO = busDAO;
    }

    public List<BusStationDTO> getAll() {
        return busDAO.getAll();
    }
    public void insertBusStation(BusStationDTO dto) {
        busDAO.insertBusStation(dto);
    }


}
