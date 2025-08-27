package com.seokhyeon2356.farmlandmatchingbe.farmland.repository;

public interface FarmlandListRow {
    Long getLandId();
    String getLandName();
    String getLandCrop();
    String getLandAddress();
    Integer getLandArea();
    Integer getLandPrice();
    Double getLandLat();
    Double getLandLng();
    Double getAiMatchScore();   // ← 조인된 점수
}

