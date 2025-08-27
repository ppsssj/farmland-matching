package com.seokhyeon2356.farmlandmatchingbe.ai.controller;

import com.seokhyeon2356.farmlandmatchingbe.ai.dto.MatchResponseDto;
import com.seokhyeon2356.farmlandmatchingbe.ai.dto.SnycRequest;
import com.seokhyeon2356.farmlandmatchingbe.ai.entity.AiMatchScore;
import com.seokhyeon2356.farmlandmatchingbe.ai.repo.AiMatchScoreRepo;
import com.seokhyeon2356.farmlandmatchingbe.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AiController {
    private final AiService aiService;
    private final AiMatchScoreRepo aiMatchScoreRepo;

    @PostMapping("/farmland/aiMatch")
    public MatchResponseDto sync(@RequestBody SnycRequest req) {
        return aiService.trainMatchAndSave(req.getBuyerId(), req.getTopK());
    }
}
