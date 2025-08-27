package com.seokhyeon2356.farmlandmatchingbe.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.seokhyeon2356.farmlandmatchingbe.ai.AiClient;
import com.seokhyeon2356.farmlandmatchingbe.ai.dto.AiFarmlandDto;
import com.seokhyeon2356.farmlandmatchingbe.ai.dto.MatchBuyerDto;
import com.seokhyeon2356.farmlandmatchingbe.ai.dto.MatchResponseDto;
import com.seokhyeon2356.farmlandmatchingbe.ai.entity.AiMatchScore;
import com.seokhyeon2356.farmlandmatchingbe.ai.repo.AiMatchScoreRepo;
import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.repository.BuyerRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.repository.TrustProfileRepository;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import com.seokhyeon2356.farmlandmatchingbe.farmland.repository.FarmlandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final FarmlandRepository farmlandRepo;
    private final BuyerRepository buyerRepo;
    private final TrustProfileRepository trustProfileRepo;
    private final AiMatchScoreRepo aiMatchScoreRepo;
    private final AiClient aiClient;
    private final ObjectMapper objectMapper; // Spring이 기본 제공

    /**
     * DB의 모든 농지를 AI에 덮어쓰기 → /train → buyerId로 /match → TOP K 점수 저장
     */
    @Transactional
    public MatchResponseDto trainMatchAndSave(long buyerId, int topK) {
        // 1) DB → AI Farmland DTO 매핑
        List<Farmland> all = farmlandRepo.findAll();
        if (all.isEmpty()) {
            throw new IllegalStateException("등록된 농지가 없습니다.");
        }
        List<AiFarmlandDto> lands = all.stream()
                .map(this::toAiFarmland)
                .collect(Collectors.toList());

        // 2) /farmlands-replace 로 전체 스냅샷 덮어쓰기
        aiClient.replaceFarmlands(lands);
        log.info("[ai-sync] replaced farmlands: {}", lands.size());

        // 3) /train 학습
        aiClient.train();
        log.info("[ai-sync] train done");

        // 4) /match 요청 바디 구성 (buyerId=1 등)
        Buyer buyer = buyerRepo.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("구매자를 찾을 수 없습니다: " + buyerId));
        TrustProfile tp = trustProfileRepo.findByBuyerId(buyerId)
                .orElseThrow(() -> new IllegalStateException("해당 구매자의 trustProfile이 없습니다: " + buyerId));

        MatchBuyerDto payload = buildBuyerPayload(buyer, tp);

        // 5) /match 호출
        MatchResponseDto res = aiClient.match(payload);
        if (res == null || res.getMatches() == null || res.getMatches().isEmpty()) {
            log.warn("[ai-sync] match 결과가 비어있습니다.");
            return new MatchResponseDto(); // 빈 응답
        }
        log.info("[ai-sync] match received: {} items", res.getMatches().size());

        // 6) TOP K 저장 (업서트)
        int k = topK <= 0 ? res.getMatches().size()
                : Math.min(topK, res.getMatches().size());
        log.info("[ai-sync] topK(input)={}, topK(effective)={}, matches={}",
                topK, k, res.getMatches().size());

        res.getMatches().stream()
                .limit(k)
                .forEach(item -> upsertScore(item, buyerId));

        return res;
    }

    // ===== 내부 헬퍼들 =====

    private AiFarmlandDto toAiFarmland(Farmland f) {
        AiFarmlandDto d = new AiFarmlandDto();
        d.setLandId(f.getLandId());
        d.setLandName(f.getLandName());
        d.setLandLat(f.getLandLat());
        d.setLandLng(f.getLandLng());
        d.setOwnerAge(f.getOwnerAge());
        d.setOwnerAddress(f.getOwnerAddress());
        d.setOwnerName(f.getOwnerName());
        d.setLandCrop(f.getLandCrop());
        d.setLandArea(f.getLandArea());
        d.setSoiltype(f.getSoiltype());
        d.setWaterSource(f.getWaterSource());
        d.setLandWater(f.getLandWater());
        d.setLandElec(f.getLandElec());
        d.setLandMachine(f.getLandMachine());
        d.setLandStorage(f.getLandStorage());
        d.setLandHouse(f.getLandHouse());
        d.setLandFence(f.getLandFence());
        d.setLandRoad(f.getLandRoad());
        d.setLandWellRoad(f.getLandWellRoad());
        d.setLandBus(f.getLandBus());
        d.setLandCar(f.getLandCar());
        d.setLandTrade(f.getLandTrade());
        d.setLandPrice(f.getLandPrice());
        d.setLandMatch(f.getLandMatch());
        d.setLandWhen(f.getLandWhen());
        d.setLandWhy(f.getLandWhy());
        d.setLandComent(f.getLandComent());
        return d;
    }

    private MatchBuyerDto buildBuyerPayload(Buyer b, TrustProfile tp) {
        MatchBuyerDto p = new MatchBuyerDto();
        p.setBuyerId(b.getBuyerId());
        p.setBuyerLat(b.getBuyerLat());
        p.setBuyerLng(b.getBuyerLng());

        MatchBuyerDto.TrustProfile t = new MatchBuyerDto.TrustProfile();
        // 아래 게터 이름은 실제 TrustProfile 엔티티에 맞춰주세요
        t.setInterestCrop(new ArrayList<>(tp.getInterestCrop()));
        t.setEquipment(new ArrayList<>(tp.getEquipment()));
        t.setWantTrade(new ArrayList<>(tp.getWantTrade()));
        t.setBudget(tp.getBudget());
        t.setWantPeriod(tp.getWantPeriod());

        p.setTrustProfile(t);
        return p;
    }

    private void upsertScore(MatchResponseDto.MatchItem item, long buyerId) {
        log.info("[UPsert] ENTER landId={}, buyerId={}, total={}",
                item.getFarmlandId(), buyerId, item.getTotalScore());

        AiMatchScore row = aiMatchScoreRepo.findByLandIdAndBuyerId(item.getFarmlandId(), buyerId)
                .orElseGet(AiMatchScore::new);

        row.setLandId(item.getFarmlandId());
        row.setBuyerId(buyerId);
        row.setAiMatchScore(item.getTotalScore());

        row.setAiMatchScore(nullIfZero(item.getTotalScore()));

        // 👇 scoreDetails -> JsonNode 로 변환해서 세팅
        row.setAiScoreDetail(objectMapper.valueToTree(item.getScoreDetails()));

        aiMatchScoreRepo.saveAndFlush(row);
        log.info("[UPsert] SAVED id={}", row.getAiMatchScoreId());
    }


    private String writeJsonSafe(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.warn("[ai-sync] score_details 직렬화 실패: {}", e.getMessage());
            return "{}";
        }
    }

    private static final double EPS = 1e-9;

    private Double nullIfZero(Double v) {
        if (v == null) return null;
        return Math.abs(v) < EPS ? null : v;  // 0 또는 극소값을 null 처리
    }
}
