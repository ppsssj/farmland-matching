package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import java.time.LocalDate;

public record FarmlandDetailRes(

        Long landId,
        String landName,
        String landAddress,
        String landRoadAddress,
        String landNumber,
        Double landLat,
        Double landLng,
        String landCrop,
        Integer landArea,
        Double landAreaha,
        String soiltype,
        String waterSource,
        String ownerName,
        Integer ownerAge,
        String ownerAddress,
        LocalDate landRegisterDate,
        Boolean landWater,
        Boolean landElec,
        Boolean landMachine,
        Boolean landStorage,
        Boolean landHouse,
        Boolean landFence,
        Boolean landRoad,
        Boolean landWellRoad,
        Boolean landBus,
        Boolean landCar,
        String landTrade,
        String landMatch,
        Integer landPrice,
        String landWhen,
        String landWhy,
        String landComent,
        String landImage
) {
}
//여기에 ai 예상 수익, ai 예상 매칭 점수 넣을듯