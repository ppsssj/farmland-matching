package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

//farmland 전체 농지 보여주기에서 aiscore땡겨오려고
public interface FarmlandListProjection {
    Long getLandId();
    String getLandName();
    String getLandCrop();
    String getLandAddress();
    Integer getLandArea();
    Integer getLandPrice();
    Double getLandLat();
    Double getLandLng();

    // AiMatchScore에서 끌어온 점수
    Double getAiMatchScore();
}
