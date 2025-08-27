package com.seokhyeon2356.farmlandmatchingbe.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MatchRequestDto {
    @JsonProperty("buyers") List<MatchBuyerDto> buyers;
}
