package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.dto;

import lombok.Getter;

@Getter
public class SuggestReq {
    Long suggestId;
    private String suggestName;
    private String suggestRelationship;
    private String suggestNumber;
    private String suggestEmail;
}
