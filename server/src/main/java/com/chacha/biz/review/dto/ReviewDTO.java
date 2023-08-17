package com.chacha.biz.review.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long review_Id;
    private float score;
    private String content;
    private LocalDateTime write_Date;
}
