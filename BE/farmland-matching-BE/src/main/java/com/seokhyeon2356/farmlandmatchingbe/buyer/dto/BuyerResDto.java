package com.seokhyeon2356.farmlandmatchingbe.buyer.dto;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import lombok.Getter;

@Getter
public class BuyerResDto {

    private Long buyerId;
    private String buyerName;
    private Integer buyerAge;
    private String buyerGender;
    private String buyerAddress;
    private Double buyerLat;
    private Double buyerLng;
    private String buyerNumber;
    private String buyerEmail;
    private String buyerImage;

    public BuyerResDto(Buyer buyer) {

        this.buyerId = buyer.getBuyerId();
        this.buyerName = buyer.getBuyerName();
        this.buyerAge = buyer.getBuyerAge();
        this.buyerGender = buyer.getBuyerGender();
        this.buyerAddress = buyer.getBuyerAddress();
        this.buyerLat = buyer.getBuyerLat();
        this.buyerLng = buyer.getBuyerLng();
        this.buyerNumber = buyer.getBuyerNumber();
        this.buyerEmail = buyer.getBuyerEmail();
        buyerImage = buyer.getBuyerImage();
    }
}
