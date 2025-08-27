package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.controller;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.dto.SuggestReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.dto.SuggestRes;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.service.SuggestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SuggestController {

    private final SuggestService suggestService;

    @PostMapping("/{buyerId}/suggest-save")
    public ResponseEntity<String> uploadSuggest(@PathVariable Long buyerId,
                                                @RequestBody List<SuggestReq> suggestReqs) {

        suggestService.saveSuggests(buyerId, suggestReqs);

        return ResponseEntity.ok("보증인 등록 완료");
    }

    @GetMapping("/{buyerId}/suggests")
    public List<SuggestRes> getSuggests(@PathVariable Long buyerId) {

        return suggestService.getSuggests(buyerId);
    }
}
