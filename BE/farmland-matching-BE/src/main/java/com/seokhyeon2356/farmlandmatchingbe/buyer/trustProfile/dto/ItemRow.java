package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto;

public record ItemRow(
        String key,
        int quantity,
        int unitPoint,
        int acquiredPoint
) {}
