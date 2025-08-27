package com.seokhyeon2356.farmlandmatchingbe.farmland.entity;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.MatchStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "matchingInfo",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"buyer_id","land_id"})
        })
public class MatchingInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchingId;

    @Enumerated(EnumType.STRING)
    private MatchStatus matchStatus = MatchStatus.WAITING;

    //private Integer recommendCount = 0;

    //private String preferences;

    /** 이 매칭(신청)이 연결된 '농지' — 한 농지에 여러 신청이 올 수 있으므로 ManyToOne */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_id")
    private Farmland farmlandMatch;

    /** 이 매칭(신청)을 한 '신청자' — 한 신청자가 여러 농지에 지원할 수도 있으므로 ManyToOne */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private Buyer buyerMatch;

    /* 추천수 증가 메서드
    public void increaseRecommendCount() {

        this.recommendCount += 1;
    }

    public void decreaseRecommendCount() {

        this.recommendCount -= 1;
    }*/
}
