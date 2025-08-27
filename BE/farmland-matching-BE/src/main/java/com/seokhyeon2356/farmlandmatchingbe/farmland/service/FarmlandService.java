package com.seokhyeon2356.farmlandmatchingbe.farmland.service;

import com.seokhyeon2356.farmlandmatchingbe.ai.repo.AiMatchScoreRepo;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.*;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import com.seokhyeon2356.farmlandmatchingbe.farmland.repository.FarmlandRepository;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.MatchStatus;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo;
import com.seokhyeon2356.farmlandmatchingbe.farmland.repository.MatchingInfoRepository;
import com.seokhyeon2356.farmlandmatchingbe.seller.entity.Seller;
import com.seokhyeon2356.farmlandmatchingbe.seller.repository.SellerRepository;
import com.seokhyeon2356.farmlandmatchingbe.supabase.service.SupabaseService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class FarmlandService {

    private final SupabaseService supabaseService;
    private final FarmlandRepository farmlandRepository;
    private final SellerRepository sellerRepository;
    private final MatchingInfoRepository matchingInfoRepository;
    private final ApplicationEventPublisher publisher;
    private final AiMatchScoreRepo aiMatchScoreRepo;

    @Transactional
    public Long saveFarmland(Long sellerId, FarmlandRequestDto dto) throws IOException {

        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("판매자를 찾을 수 없습니다: " + sellerId));

        String landRegisterUrl = supabaseService.uploadFile(dto.getLandRegister());
        String landCadastreUrl = supabaseService.uploadFile(dto.getLandCadastre());
        String landCertificationUrl = supabaseService.uploadFile(dto.getLandCertification());
        String landImageUrl = supabaseService.uploadFile(dto.getLandImage());

        Farmland farmland = Farmland.builder()
                .landName(dto.getLandName())
                .landAddress(dto.getLandAddress())
                .landRoadAddress(dto.getLandLoadAddress())
                .landNumber(dto.getLandNumber())
                .landCrop(dto.getLandCrop())
                .landArea(dto.getLandArea())
                .landAreaha(dto.getLandAreaha())
                .landLat(dto.getLandLat())
                .landLng(dto.getLandLng())
                .soiltype(dto.getSoiltype())
                .waterSource(dto.getWaterSource())
                .ownerName(dto.getOwnerName())
                .ownerAge(dto.getOwnerAge())
                .ownerAddress(dto.getOwnerAddress())
                .landWater(dto.getLandWater())
                .landElec(dto.getLandElec())
                .landMachine(dto.getLandMachine())
                .landStorage(dto.getLandStorage())
                .landHouse(dto.getLandHouse())
                .landFence(dto.getLandFence())
                .landRoad(dto.getLandRoad())
                .landWellRoad(dto.getLandWellRoad())
                .landBus(dto.getLandBus())
                .landCar(dto.getLandCar())
                .landTrade(dto.getLandTrade())
                .landMatch(dto.getLandMatch())
                .landPrice(dto.getLandPrice())
                .landWhen(dto.getLandWhen())
                .landWhy(dto.getLandWhy())
                .landComent(dto.getLandComent())
                .landRegister(landRegisterUrl)
                .landCadastre(landCadastreUrl)
                .landCertification(landCertificationUrl)
                .landImage(landImageUrl)
                .sellerFarmland(seller)
                .build();

        // 3. DB 저장
        farmlandRepository.save(farmland);

        return farmland.getLandId();
    }

    //농지 정보 수정
    @Transactional
    public void updateFarmland(Long sellerId, Long landId, SellerFarmlandUpdateReq uReq) throws IOException{
        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));
        ensureOwner(f, sellerId);

        if (uReq.landName() != null) f.setLandName(uReq.landName());
        if (uReq.landAddress() != null) f.setLandAddress(uReq.landAddress());
        if (uReq.landRoadAddress() != null) f.setLandRoadAddress(uReq.landRoadAddress());
        if (uReq.landNumber() != null) f.setLandNumber(uReq.landNumber());
        if (uReq.landLat() != null) f.setLandLat(uReq.landLat());
        if (uReq.landLng() != null) f.setLandLng(uReq.landLng());
        if (uReq.landCrop() != null) f.setLandCrop(uReq.landCrop());
        if (uReq.landArea() != null) f.setLandArea(uReq.landArea());
        if (uReq.soiltype() != null) f.setSoiltype(uReq.soiltype());
        if (uReq.waterSource() != null) f.setWaterSource(uReq.waterSource());
        if (uReq.ownerName() != null) f.setOwnerName(uReq.ownerName());
        if (uReq.ownerAge() != null) f.setOwnerAge(uReq.ownerAge());
        if (uReq.ownerAddress() != null) f.setOwnerAddress(uReq.ownerAddress());
        if (uReq.landWater() != null) f.setLandWater(uReq.landWater());
        if (uReq.landElec() != null) f.setLandElec(uReq.landElec());
        if (uReq.landMachine() != null) f.setLandMachine(uReq.landMachine());
        if (uReq.landStorage() != null) f.setLandStorage(uReq.landStorage());
        if (uReq.landHouse() != null) f.setLandHouse(uReq.landHouse());
        if (uReq.landFence() != null) f.setLandFence(uReq.landFence());
        if (uReq.landRoad() != null) f.setLandRoad(uReq.landRoad());
        if (uReq.landWellRoad() != null) f.setLandWellRoad(uReq.landWellRoad());
        if (uReq.landBus() != null) f.setLandBus(uReq.landBus());
        if (uReq.landCar() != null) f.setLandCar(uReq.landCar());
        if (uReq.landTrade() != null) f.setLandTrade(uReq.landTrade());
        if (uReq.landMatch() != null) f.setLandMatch(uReq.landMatch());
        if (uReq.landPrice() != null) f.setLandPrice(uReq.landPrice());
        if (uReq.landWhen() != null) f.setLandWhen(uReq.landWhen());
        if (uReq.landWhy() != null) f.setLandWhy(uReq.landWhy());
        if (uReq.landComent() != null) f.setLandComent(uReq.landComent());

        if (isPresent(uReq.landImage())){
            String imageURL = supabaseService.uploadFile(uReq.landImage());
            supabaseService.delete(f.getLandImage());
            f.setLandImage(imageURL);
        }

        if (isPresent(uReq.landRegister())){
            String registerURL = supabaseService.uploadFile(uReq.landRegister());
            supabaseService.delete(f.getLandRegister());
            f.setLandRegister(registerURL);
        }

        if (isPresent(uReq.landCadastre())){
            String cadastreURL = supabaseService.uploadFile(uReq.landCadastre());
            supabaseService.delete(f.getLandCadastre());
            f.setLandCadastre(cadastreURL);
        }

        if (isPresent(uReq.landCertification())){
            String certificationURL = supabaseService.uploadFile(uReq.landCertification());
            supabaseService.delete(f.getLandCertification());
            f.setLandCertification(certificationURL);
        }
    }

    private boolean isPresent(MultipartFile file) {

        return file != null && !file.isEmpty();
    }

    //농지 삭제
    @Transactional
    public void deleteFarmland(Long sellerId, Long landId) {

        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));

        ensureOwner(f, sellerId);

        farmlandRepository.delete(f);
    }

    //신청 수락
    @Transactional
    public void acceptApplicant(Long sellerId, Long landId, Long buyerId) {
        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));
        ensureOwner(f, sellerId);

        MatchingInfo mine = matchingInfoRepository
                .findDetailBuyerInfoAndTrustAndLicenses(landId, buyerId)
                .orElseThrow(() -> new IllegalArgumentException("신청 정보를 찾을 수 없습니다."));

        mine.setMatchStatus(MatchStatus.IN_PROGRESS);
    }

    //신청 거절
    @Transactional
    public void rejectApplicant(Long sellerId, Long landId, Long buyerId) {
        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));
        ensureOwner(f, sellerId);

        MatchingInfo mi = matchingInfoRepository
                .findDetailBuyerInfoAndTrustAndLicenses(landId, buyerId)
                .orElseThrow(() -> new IllegalArgumentException("신청 정보를 찾을 수 없습니다."));

        mi.setMatchStatus(MatchStatus.REJECTED);
    }

    //판매자가 등록한 농지 전체보기
    @Transactional
    public List<SellerFarmlandListRes> getFarmlandsBySeller(Long sellerId) {
        return farmlandRepository.findAllFarmlandByseller(sellerId);
    }

    //농지 상세 보기 (신청자 목록까지 보이기)
    public SellerFarmlandDetailRes getFarmlandDetail(Long sellerId, Long landId) {
        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));

        ensureOwner(f, sellerId);

        List<MatchingInfo> list = matchingInfoRepository.findAllBuyerByLandId(landId);

        return SellerFarmlandDetailRes.of(f, list);
    }

    //신청자 상세보기
    public ApplicantsDetailRes getApplicantDetail(Long sellerId, Long landId, Long buyerId) {

        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));
        ensureOwner(f, sellerId);

        MatchingInfo mi = matchingInfoRepository
                .findDetailBuyerInfoAndTrustAndLicenses(landId, buyerId)
                .orElseThrow(() -> new IllegalArgumentException("신청 정보를 찾을 수 없습니다."));

        return ApplicantsDetailRes.of(mi);
    }

    //소유자 인증?
    private void ensureOwner(Farmland f, Long sellerId) {
        if (f.getSellerFarmland() == null || !f.getSellerFarmland().getSellerId().equals(sellerId)) {
            throw new IllegalArgumentException("해당 농지의 소유자가 아닙니다.");
        }
    }

    //농지 전체보기(구매자 사이트)
    @Transactional
    public List<FarmlandListRes> getFarmlandsWithScore(Long buyerId) {
        return farmlandRepository.findAllWithAiScore(buyerId).stream()
                .map(r -> new FarmlandListRes(
                        r.getLandId(), r.getLandName(), r.getLandCrop(),
                        r.getLandAddress(), r.getLandArea(), r.getLandPrice(),
                        r.getLandLat(), r.getLandLng(), r.getAiMatchScore() // ← 채워짐 (없으면 null)
                ))
                .toList();
    }

    //농지 상세보기 (구매자 사이트)
    public FarmlandDetailRes getFarmlandDetail(Long landId) {

        Farmland f = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다"));

        return new FarmlandDetailRes(
                f.getLandId(),
                f.getLandName(),
                f.getLandAddress(),
                f.getLandRoadAddress(),
                f.getLandNumber(),
                f.getLandLat(),
                f.getLandLng(),
                f.getLandCrop(),
                f.getLandArea(),
                f.getLandAreaha(),
                f.getSoiltype(),
                f.getWaterSource(),
                f.getOwnerName(),
                f.getOwnerAge(),
                f.getOwnerAddress(),
                f.getLandRegisterDate(),
                f.getLandWater(),
                f.getLandElec(),
                f.getLandMachine(),
                f.getLandStorage(),
                f.getLandHouse(),
                f.getLandFence(),
                f.getLandRoad(),
                f.getLandWellRoad(),
                f.getLandBus(),
                f.getLandCar(),
                f.getLandTrade(),
                f.getLandMatch(),
                f.getLandPrice(),
                f.getLandWhen(),
                f.getLandWhy(),
                f.getLandComent(),
                f.getLandImage()
        );
    }

    //농지 상세보기 (aiScore 보이는 곳)
    @Transactional
    public MatchScoreDetailDto getMatchScoreDetail(long buyerId, long farmlandId) {
        var row = aiMatchScoreRepo.findByLandIdAndBuyerId(farmlandId, buyerId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "매칭 점수가 없습니다. buyerId=%d, landId=%d".formatted(buyerId, farmlandId)));

        return new MatchScoreDetailDto(
                farmlandId,
                buyerId,
                row.getAiMatchScore(),
                row.getAiScoreDetail()   // JsonNode 그대로 반환
        );
    }
}


