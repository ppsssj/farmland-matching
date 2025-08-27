package com.seokhyeon2356.farmlandmatchingbe.buyer.dto;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
public class BuyerUpdateReq {

    private String buyerName;
    private Integer buyerAge;
    private String buyerGender;
    private String buyerNumber;
    private String buyerEmail;
    private String buyerAddress;
    private Double buyerLat;
    private Double buyerLng;
    private MultipartFile buyerImage;
}
