package com.seokhyeon2356.farmlandmatchingbe.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class MatchResponseDto {

    @Data
    public static class MatchItem {
        @JsonProperty("farmland_id")   Long farmlandId;
        @JsonProperty("farmland_name") String farmlandName;

        @JsonProperty("total_score")   Double totalScore;

        // 예: {"distance":25, "crop":12.5, "facility":25, "area":2.1575...}
        @JsonProperty("score_details") Map<String, Object> scoreDetails;
    }

    @JsonProperty("matches")
    List<MatchItem> matches;
}
