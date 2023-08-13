package com.chacha.biz.dao;

import com.chacha.biz.dto.BusStationDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

//implements BusService
@Repository("busDAO")
public class BusDAO  {


    private final SqlSessionTemplate mybatis;
    public BusDAO(SqlSessionTemplate mybatis){
        this.mybatis = mybatis;
    }
    //@Override
    public List<BusStationDTO> getAll() {
        return mybatis.selectList("BusDAO.getAll");
    }

    //@Override
    public void insertBusStation(BusStationDTO dto) {
        mybatis.insert("BusDAO.insertBusStation",dto);
    }
}
