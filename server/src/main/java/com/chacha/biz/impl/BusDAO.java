package com.chacha.biz.impl;

import com.chacha.biz.dto.BusStationDTO;
import com.chacha.biz.mapper.BusService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("busDAO")
public class BusDAO implements BusService {


    private final SqlSessionTemplate mybatis;
    public BusDAO(SqlSessionTemplate mybatis){
        this.mybatis = mybatis;
    }
    @Override
    public List<BusStationDTO> getAll() {
        return mybatis.selectList("BusDAO.getAll");
    }

    @Override
    public void insertBusStation(BusStationDTO dto) {
        mybatis.insert("BusDAO.insertBusStation",dto);
    }
}
