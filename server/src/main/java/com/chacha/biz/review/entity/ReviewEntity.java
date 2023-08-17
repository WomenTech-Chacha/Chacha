package com.chacha.biz.review.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Entity(name="review")
@Getter
public class ReviewEntity {
    @Id
    private Long review_Id;
    private float score;
    private String satis;
    private String dissatis;
    @CreationTimestamp
    private LocalDateTime write_Date;

    @Builder
    public ReviewEntity(Long review_Id, float score, String satis, String dissatis, LocalDateTime write_Date ){
        this.review_Id = review_Id;
        this.score = score;
        this.satis = satis;
        this.dissatis = dissatis;
        this.write_Date = write_Date;
    }
}
