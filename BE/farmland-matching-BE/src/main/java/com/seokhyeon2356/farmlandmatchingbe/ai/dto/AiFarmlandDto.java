package com.seokhyeon2356.farmlandmatchingbe.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AiFarmlandDto {
    @JsonProperty("landId")   Long landId;
    @JsonProperty("landName") String landName;
    @JsonProperty("landLat")  Double landLat;
    @JsonProperty("landLng")  Double landLng;
    @JsonProperty("ownerAge") Integer ownerAge;
    @JsonProperty("ownerAddress") String ownerAddress;
    @JsonProperty("ownerName") String ownerName;
    @JsonProperty("landCrop") String landCrop;
    @JsonProperty("landArea") Integer landArea;
    @JsonProperty("soiltype") String soiltype;
    @JsonProperty("waterSource") String waterSource;

    // 설비/접근성은 불리언이면 그대로, 문자열(있음/없음)이면 변환해 세팅해서 보냄
    @JsonProperty("landWater") Boolean landWater;
    @JsonProperty("landElec")  Boolean landElec;
    @JsonProperty("landMachine") Boolean landMachine;
    @JsonProperty("landStorage") Boolean landStorage;
    @JsonProperty("landHouse")   Boolean landHouse;
    @JsonProperty("landFence")   Boolean landFence;
    @JsonProperty("landRoad")    Boolean landRoad;
    @JsonProperty("landWellRoad") Boolean landWellRoad;
    @JsonProperty("landBus")     Boolean landBus;
    @JsonProperty("landCar")     Boolean landCar;
    @JsonProperty("landTrade") String landTrade;
    @JsonProperty("landPrice") Integer landPrice;
    @JsonProperty("landMatch") String landMatch;
    @JsonProperty("landWhen") String landWhen;
    @JsonProperty("landWhy") String landWhy;
    @JsonProperty("landComent") String landComent;
}
