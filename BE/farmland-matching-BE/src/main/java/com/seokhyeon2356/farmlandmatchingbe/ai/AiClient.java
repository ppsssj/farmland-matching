package com.seokhyeon2356.farmlandmatchingbe.ai;

import com.seokhyeon2356.farmlandmatchingbe.ai.dto.MatchBuyerDto;
import com.seokhyeon2356.farmlandmatchingbe.ai.dto.AiFarmlandDto;
import com.seokhyeon2356.farmlandmatchingbe.ai.dto.MatchResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Service("aiScoreClient")
@RequiredArgsConstructor
@Slf4j
public class AiClient {
    private final WebClient aiClient;

    public void replaceFarmlands(List<AiFarmlandDto> lands) {
        log.info("[ai] POST /farmlands-replace count={}", lands.size());
        aiClient.post()
                .uri("/farmlands-replace")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(lands)
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    log.error("[ai] /farmlands-replace failed", e);
                    return Mono.error(e);
                })
                .block();
    }

    public void train() {
        log.info("[ai] POST /train");
        aiClient.post().uri("/train")
                .retrieve()
                .bodyToMono(Void.class)
                .onErrorResume(e -> {
                    log.error("[ai] /train failed", e);
                    return Mono.error(e);
                })
                .block();
    }

    public MatchResponseDto match(MatchBuyerDto payload) {
        log.info("[ai] POST /match buyerId={}", payload.getBuyerId());
        return aiClient.post().uri("/match")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(MatchResponseDto.class)
                .block();
    }

}