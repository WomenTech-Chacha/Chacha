package com.chacha.biz.busReservation.repository;

import com.chacha.biz.busReservation.entity.BusReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusReservationRepository extends JpaRepository<BusReservationEntity, Long> {
}
