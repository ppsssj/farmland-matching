package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import lombok.Getter;

import java.util.List;

@Getter
public class TrustProfileRes {

    private List<String> interestCrop;
    private List<String> equipment;
    private List<String> wantTrade;
    private List<String> awards;
    private String experience;
    private String experiencePeriod;
    private String experienceDetail;
    private String rentPeriod;
    private String other;
    private Integer budget;
    private String wantPeriod;
    private String oneIntroduction;
    private String introduction;
    private String videoURL;
    private String sns;
    private String personal;

    public TrustProfileRes(TrustProfile trustProfile) {

        this.interestCrop = trustProfile.getInterestCrop();
        this.equipment = trustProfile.getEquipment();
        this.wantTrade = trustProfile.getWantTrade();
        this.awards = trustProfile.getAwards();
        this.experience = trustProfile.getExperience();
        this.experiencePeriod = trustProfile.getExperiencePeriod();
        this.experienceDetail = trustProfile.getExperienceDetail();
        this.rentPeriod = trustProfile.getRentPeriod();
        this.other = trustProfile.getOther();
        this.budget = trustProfile.getBudget();
        this.wantPeriod = trustProfile.getWantPeriod();
        this.oneIntroduction = trustProfile.getOneIntroduction();
        this.introduction = trustProfile.getIntroduction();
        this.videoURL = trustProfile.getVideoURL();
        this.sns = trustProfile.getSns();
        this.personal = trustProfile.getPersonal();
    }
}
