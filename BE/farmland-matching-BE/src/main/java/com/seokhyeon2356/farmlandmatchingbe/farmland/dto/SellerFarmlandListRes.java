package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;

public record SellerFarmlandListRes(
        Long landId, String landName, String landAddress, String landCrop, Integer landArea, MatchStatus matchStatus
) {
    public static SellerFarmlandListRes from(Farmland f, MatchStatus status) {
        return new SellerFarmlandListRes(
                f.getLandId(),
                f.getLandName(),
                f.getLandAddress(),
                f.getLandCrop(),
                f.getLandArea(),
                status
        );
    }
}

