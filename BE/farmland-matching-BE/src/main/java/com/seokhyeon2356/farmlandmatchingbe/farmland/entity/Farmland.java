package com.seokhyeon2356.farmlandmatchingbe.farmland.entity;

import com.seokhyeon2356.farmlandmatchingbe.ai.entity.AiMatchScore;
import com.seokhyeon2356.farmlandmatchingbe.seller.entity.Seller;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "farmland")
public class Farmland {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "land_id", nullable = false)
    private Long landId;
    private String landName;
    private String landAddress;
    private String landRoadAddress;
    private String landNumber;
    private Double landLat; //위도
    private Double landLng; //경도
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

    @CreatedDate
    private LocalDate landRegisterDate;

    private String landRegister;
    private String landCadastre;
    private String landCertification;
    private String landImage;

    @OneToMany(mappedBy = "farmlandMatch")
    private List<MatchingInfo> matchingInfo =  new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sellerId")
    private Seller sellerFarmland;
}
