package com.chacha.biz.busReservation;

import com.chacha.biz.busStation.BusStationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusReservationRepository extends JpaRepository<BusReservationEntity, Long> {
}
