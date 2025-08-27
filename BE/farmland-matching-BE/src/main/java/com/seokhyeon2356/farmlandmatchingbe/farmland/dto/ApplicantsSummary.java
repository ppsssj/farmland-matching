package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo;

public record ApplicantsSummary(
        Long buyerId, String buyerName, Integer buyerAge, String buyerGender, String buyerAddress
) {
    public static ApplicantsSummary from(MatchingInfo mi) {
        Buyer b = mi.getBuyerMatch();
        return new ApplicantsSummary(
                b.getBuyerId(), b.getBuyerName(), b.getBuyerAge(), b.getBuyerGender(), b.getBuyerAddress()
        );
    }
}
