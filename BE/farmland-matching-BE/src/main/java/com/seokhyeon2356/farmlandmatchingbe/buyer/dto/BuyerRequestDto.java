package com.seokhyeon2356.farmlandmatchingbe.buyer.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class BuyerRequestDto {

    private String buyerName;
    private Integer buyerAge;
    private String buyerGender;
    private String buyerAddress;
    private Double buyerLat;
    private Double buyerLng;
    private String buyerNumber;
    private String buyerEmail;
    private MultipartFile buyerImage;
}
