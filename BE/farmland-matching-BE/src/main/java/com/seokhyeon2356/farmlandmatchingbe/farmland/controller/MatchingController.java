package com.seokhyeon2356.farmlandmatchingbe.farmland.controller;

import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.MatchStatus;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.MyAppliedLandDto;
import com.seokhyeon2356.farmlandmatchingbe.farmland.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MatchingController {
    private final MatchingService matchingService;

    //농지 신청하기
    @PostMapping("/farmland/{landId}/{buyerId}/apply")
    public ResponseEntity<Map<String, Object>> apply(
            @PathVariable Long landId,
            @PathVariable Long buyerId
    ) {
        Long matchingId = matchingService.apply(landId, buyerId);
        return ResponseEntity.ok(Map.of(
                "message", "신청 완료",
                "matchingId", matchingId
        ));
    }

    //농지 신청 삭제하기
    @DeleteMapping("/farmland/{landId}/{buyerId}/apply-cancel")
    public ResponseEntity<Map<String, Object>> cancelHard(
            @PathVariable Long landId,
            @PathVariable Long buyerId
    ) {
        matchingService.cancelApply(landId, buyerId);
        return ResponseEntity.ok(Map.of(
                "message", "신청 삭제 완료",
                "landId", landId,
                "buyerId", buyerId
        ));
    }

    //신청한 농지 목록 보이기
    @GetMapping("/applied-farmland/{buyerId}")
    public List<MyAppliedLandDto> myApplied(@PathVariable Long buyerId) {

        return matchingService.listByBuyer(buyerId);
    }

    //농지 즐겨찾기
    //농지 즐겨찾기 목록 보이기
    //@GetMapping("/{buyerId}/farmland-favorites")

    //농지 즐겨찾기 등록
    //@PostMapping("/{buyerId}/farmland-favorites/{landId}")

    //농지 즐겨찾기 취소
    //@DeleteMapping("/{buyerId}/farmland-favorites-cancel/{landId}")
}
