package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto;

public record TrustScore(
        int total,
        ItemRow license,
        ItemRow suggest,
        ItemRow sns,
        ItemRow awards,
        ItemRow oneIntroduction,
        ItemRow introduction,
        int licenseQuantity,
        int suggestQuantity,
        int awardsQuantity,
        boolean hasSns,
        boolean hasOneIntroduction,
        boolean hasIntroduction
) {
}
