package com.chacha.biz.busStation.repository;

import com.chacha.biz.busStation.entity.BusStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusStationRepository extends JpaRepository<BusStationEntity, Integer> {
}
