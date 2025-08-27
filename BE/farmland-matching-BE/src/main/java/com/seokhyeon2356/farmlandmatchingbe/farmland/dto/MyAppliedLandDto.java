package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record MyAppliedLandDto(

        Long landId,
        String landName,
        String landAddress,
        String landCrop,
        LocalDate landRegisterDate,
        String landImage,
        String matchStatus
        //예상수익

) {
    public static MyAppliedLandDto from(MatchingInfo mi) {

        Farmland farmland = mi.getFarmlandMatch();
        return new MyAppliedLandDto(
                farmland.getLandId(),
                farmland.getLandName(),
                farmland.getLandAddress(),
                farmland.getLandCrop(),
                farmland.getLandRegisterDate(),
                farmland.getLandImage(),
                mi.getMatchStatus().name()
        );
    }
}
