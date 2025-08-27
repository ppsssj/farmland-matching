package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.dto;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.entity.Suggest;
import lombok.Getter;

@Getter
public class SuggestRes {
    private Long suggestId;
    private String suggestName;
    private String suggestRelationship;
    private String suggestNumber;
    private String suggestEmail;

    public SuggestRes(Suggest r) {
        this.suggestId = r.getSuggestId();
        this.suggestName = r.getSuggestName();
        this.suggestRelationship = r.getSuggestRelationship();
        this.suggestNumber = r.getSuggestNumber();
        this.suggestEmail = r.getSuggestEmail();
    }
}
