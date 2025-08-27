package com.seokhyeon2356.farmlandmatchingbe.seller.dto;

import lombok.Getter;

@Getter
public class SellerUpdateRequestDto {

    private String sellerName;
    private Integer sellerYear;
    private String sellerNumber;
    private String sellerAddress;
    private Integer sellerLand;
}
