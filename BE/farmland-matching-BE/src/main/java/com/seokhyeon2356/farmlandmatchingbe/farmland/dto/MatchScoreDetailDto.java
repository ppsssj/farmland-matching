package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record MatchScoreDetailDto(
        Long landId,
        Long buyerId,
        Double aiMatchScore,
        JsonNode aiScoreDetail
) {
}
