package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;

public record FarmlandListRes(
        Long landId,
        String landName,
        String landCrop,
        String landAddress,
        Integer landArea,
        Integer landPrice,
        Double landLat,
        Double landLng,
        Double aiMatchScore      // ✅ 추가
) {
    // 기존 from(Farmland) 는 유지해도 되고, 아래 새 팩토리 추가
    public static FarmlandListRes fromProjection(FarmlandListProjection p) {
        return new FarmlandListRes(
                p.getLandId(),
                p.getLandName(),
                p.getLandCrop(),
                p.getLandAddress(),
                p.getLandArea(),
                p.getLandPrice(),
                p.getLandLat(),
                p.getLandLng(),
                p.getAiMatchScore()  // null이면 "계산중"
        );
    }
}
