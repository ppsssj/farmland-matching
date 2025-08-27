package com.seokhyeon2356.farmlandmatchingbe.ai.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class MatchBuyerDto {
    Long buyerId;

    Double buyerLat;
    Double buyerLng;

    TrustProfile trustProfile;

    @Data
    public static class TrustProfile {
        public List<String> interestCrop;
        public List<String> equipment;
        public List<String> wantTrade;
        public Integer budget;
        public String wantPeriod;
    }

}
