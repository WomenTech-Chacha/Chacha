package com.chacha.biz.review.repository;

import com.chacha.biz.busStation.entity.BusStationEntity;
import com.chacha.biz.review.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository  extends JpaRepository<ReviewEntity, Long> {
}
