package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrustProfileReq {

    private List<String> interestCrop;
    private List<String> equipment;
    private List<String> wantTrade;
    private List<String> awards;
    private String experience;
    private String experiencePeriod;
    private String experienceDetail;
    private Integer budget;
    private String wantPeriod;
    private String rentPeriod;
    private String other;
    private String oneIntroduction;
    private String introduction;
    private String videoURL;
    private String sns;
    private String personal;
}
