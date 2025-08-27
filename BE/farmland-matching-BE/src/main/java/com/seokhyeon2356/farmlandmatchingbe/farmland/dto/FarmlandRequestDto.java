package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class FarmlandRequestDto {

    private String landName;
    private String landAddress;
    private String landLoadAddress;
    private Double landLat;
    private Double landLng;
    private String landNumber;
    private String landCrop;
    private Integer landArea;
    private Double landAreaha;
    private String soiltype;
    private String waterSource;
    private String ownerName;
    private Integer ownerAge;
    private String ownerAddress;
    private Boolean landWater;
    private Boolean landElec;
    private Boolean landMachine;
    private Boolean landStorage;
    private Boolean landHouse;
    private Boolean landFence;
    private Boolean landRoad;
    private Boolean landWellRoad;
    private Boolean landBus;
    private Boolean landCar;
    private String landTrade;
    private String landMatch;
    private Integer landPrice;
    private String landWhen;
    private String landWhy;
    private String landComent;
    private MultipartFile landRegister;
    private MultipartFile landCadastre;
    private MultipartFile landCertification;
    private MultipartFile landImage;
}
