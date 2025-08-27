package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.controller;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.TrustProfileReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.TrustProfileRes;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.TrustScore;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.service.TrustProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TrustProfileController {

    private final TrustProfileService trustProfileService;

    //신뢰프로필 저장/수정
    @PostMapping("/buyer-trustProfile-save/{buyerId}")
    public ResponseEntity<Map<String, Object>> trustProfileUpload(@PathVariable Long buyerId,
                                                                   @RequestBody TrustProfileReq trustProfileReq) {

        Long trust = trustProfileService.saveTrustProfile(buyerId, trustProfileReq);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "신뢰프로필 등록 완료");
        response.put("trustProfileId", trust);

        return ResponseEntity.ok(response);
    }

    //신뢰프로필 정보 불러오기
    @GetMapping("/buyer-trustProfile/{buyerId}")
    public ResponseEntity<TrustProfileRes> getTrust(@PathVariable Long buyerId) {

        TrustProfileRes tp = trustProfileService.getTrustProfile(buyerId);
        return ResponseEntity.ok(tp);
    }

    //신뢰 점수 불러오기
    @GetMapping("/{buyerId}/trust-score")
    public TrustScore getScore(@PathVariable Long buyerId) {

        return trustProfileService.compute(buyerId);
    }
}
