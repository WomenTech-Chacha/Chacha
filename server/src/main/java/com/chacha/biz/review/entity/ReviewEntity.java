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
    @Column(length = 1000)
    private String content;
    @CreationTimestamp
    private LocalDateTime write_Date;

    @Builder
    public ReviewEntity(Long review_Id, float score, String content, LocalDateTime write_Date ){
        this.review_Id = review_Id;
        this.score = score;
        this.content = content;
        this.write_Date = write_Date;
    }
}
