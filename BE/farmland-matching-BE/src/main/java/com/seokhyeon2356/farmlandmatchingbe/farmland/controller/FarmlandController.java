package com.seokhyeon2356.farmlandmatchingbe.farmland.controller;

import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.*;
import com.seokhyeon2356.farmlandmatchingbe.farmland.service.FarmlandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class FarmlandController {

    private final FarmlandService farmlandService;

    @PostMapping("/{sellerId}/farmland-upload")
    public ResponseEntity<Map<String,Object>> createFarmland(@PathVariable Long sellerId, @ModelAttribute FarmlandRequestDto dto) throws IOException {

        Long landId = farmlandService.saveFarmland(sellerId, dto);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "농지 등록 완료");
        response.put("land_id", landId);

        return ResponseEntity.ok(response);
    }

    //seller의 모든 농지 조회
    @GetMapping("/{sellerId}/farmland")
    public List<SellerFarmlandListRes> listBySeller(@PathVariable Long sellerId) {
        return farmlandService.getFarmlandsBySeller(sellerId);
    }

    //농지 수정
    @PatchMapping("/{sellerId}/farmland-update/{landId}")
    public ResponseEntity<String> update(
            @PathVariable Long sellerId,
            @PathVariable Long landId,
            @ModelAttribute SellerFarmlandUpdateReq req
    ) throws IOException {

        farmlandService.updateFarmland(sellerId, landId, req);
        return ResponseEntity.ok("농지 정보 수정 완료");
    }

    //농지 삭제
    @DeleteMapping("/{sellerId}/farmland-delete/{landId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long sellerId,
            @PathVariable Long landId
    ) {
        farmlandService.deleteFarmland(sellerId, landId);
        return ResponseEntity.ok().build();
    }

    //농지 상세보기(판매자 사이트)
    @GetMapping("/{sellerId}/farmland/{landId}")
    public SellerFarmlandDetailRes getDetail(
            @PathVariable Long sellerId,
            @PathVariable Long landId
    ) {
        return farmlandService.getFarmlandDetail(sellerId, landId);
    }

    //신청자 상세보기
    @GetMapping("/{sellerId}/farmland/{landId}/applicants/{buyerId}")
    public ApplicantsDetailRes getApplicantDetail(
            @PathVariable Long sellerId,
            @PathVariable Long landId,
            @PathVariable Long buyerId
    ) {
        return farmlandService.getApplicantDetail(sellerId, landId, buyerId);
    }

    //신청자 신청 수락
    @PostMapping("/{sellerId}/farmland/{landId}/applicants/{buyerId}/accept")
    public ResponseEntity<Void> accept(
            @PathVariable Long sellerId,
            @PathVariable Long landId,
            @PathVariable Long buyerId
    ) {
        farmlandService.acceptApplicant(sellerId, landId, buyerId);
        return ResponseEntity.ok().build();
    }

    //신청자 신청 거절
    @PostMapping("/{sellerId}/farmland/{landId}/applicants/{buyerId}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable Long sellerId,
            @PathVariable Long landId,
            @PathVariable Long buyerId
    ) {
        farmlandService.rejectApplicant(sellerId, landId, buyerId);
        return ResponseEntity.ok().build();
    }

    //그냥 모든 농지 보이기(구매자 사이트)
    @GetMapping("/farmland")
    public List<FarmlandListRes> getAllFarmland() {

        return farmlandService.getFarmlandsWithScore(1L);
    }

    //(구매자 사이트)농지 상세보기
    @GetMapping("/farmland-detail/{landId}")
    public FarmlandDetailRes getFarmlandDetail(@PathVariable Long landId) {

        return farmlandService.getFarmlandDetail(landId);
    }

    //농지 상세보기 (ai 매칭부분)
    @GetMapping("/farmland-detail-matchScore/{buyerId}/{landId}")
    public ResponseEntity<MatchScoreDetailDto> getDetailMatchScore(
            @PathVariable long buyerId,
            @PathVariable long landId) {

        try {
            MatchScoreDetailDto dto = farmlandService.getMatchScoreDetail(buyerId, landId);
            return ResponseEntity.ok(dto);
        } catch (jakarta.persistence.EntityNotFoundException e) {
            // 점수가 아직 저장되지 않은 케이스 → 204로 처리
            return ResponseEntity.noContent().build();
        }
    }
}
