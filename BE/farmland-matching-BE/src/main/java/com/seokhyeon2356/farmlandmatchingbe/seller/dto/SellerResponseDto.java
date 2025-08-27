package com.seokhyeon2356.farmlandmatchingbe.seller.dto;

import com.seokhyeon2356.farmlandmatchingbe.seller.entity.Seller;
import lombok.Getter;

@Getter
public class SellerResponseDto {

    private Long sellerId;
    private String name;
    private Integer year;
    private String address;
    private String phoneNumber;
    private Integer land;

    public SellerResponseDto(Seller seller) {

        this.sellerId = seller.getSellerId();
        this.name = seller.getSellerName();
        this.year = seller.getSellerYear();
        this.address = seller.getSellerAddress();
        this.phoneNumber = seller.getSellerNumber();
        this.land = seller.getSellerLand();
    }
}
