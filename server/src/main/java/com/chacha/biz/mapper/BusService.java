package com.chacha.biz.mapper;


import com.chacha.biz.dto.BusStationDTO;

import java.util.List;

public interface BusService {
    public List<BusStationDTO> getAll();
    public void insertBusStation(BusStationDTO dto);
}
