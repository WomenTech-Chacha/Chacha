package com.chacha.biz.review.controller;

import com.chacha.biz.review.dto.ReviewDTO;
import com.chacha.biz.review.entity.ReviewEntity;
import com.chacha.biz.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewRepository reviewRepository;

    @PostMapping(value = "/review")
    public ResponseEntity saveReview(@RequestBody ReviewDTO reviewDTO){
        ReviewEntity review = ReviewEntity.builder()
                .review_Id(reviewDTO.getReview_Id())
                .score(reviewDTO.getScore())
                .satis(reviewDTO.getSatis())
                .dissatis(reviewDTO.getDissatis())
                .build();
        reviewRepository.save(review);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
