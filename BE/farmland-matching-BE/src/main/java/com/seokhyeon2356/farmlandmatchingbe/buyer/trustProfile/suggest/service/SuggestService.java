package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.service;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.repository.BuyerRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.service.TrustProfileService;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.dto.SuggestReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.dto.SuggestRes;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.entity.Suggest;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.repo.SuggestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuggestService {

    private final SuggestRepository suggestRepository;
    private final BuyerRepository buyerRepository;
    private final TrustProfileService trustProfileService;

    @Transactional
    public void saveSuggests(Long buyerId, List<SuggestReq> reqs) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found: " + buyerId));

        // 현재 DB에 저장된 추천인 목록
        List<Suggest> existing = suggestRepository.findByBuyerSuggest_BuyerId(buyerId);

        // 요청에 담긴 id set
        Set<Long> requestIds = reqs.stream()
                .map(SuggestReq::getSuggestId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 1) 삭제할 것 찾기
        List<Suggest> toDelete = existing.stream()
                .filter(r -> !requestIds.contains(r.getSuggestId()))
                .toList();
        suggestRepository.deleteAll(toDelete);

        // 2) 추가/수정
        for (SuggestReq req : reqs) {
            if (req.getSuggestId() == null) {
                // 신규 추가
                Suggest r = Suggest.builder()
                        .suggestName(req.getSuggestName())
                        .suggestRelationship(req.getSuggestRelationship())
                        .suggestNumber(req.getSuggestNumber())
                        .suggestEmail(req.getSuggestEmail())
                        .buyerSuggest(buyer)
                        .build();
                suggestRepository.save(r);
            } else {
                // 기존 수정
                Suggest r = existing.stream()
                        .filter(e -> e.getSuggestId().equals(req.getSuggestId()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Recommender not found: " + req.getSuggestId()));

                r.setSuggestName(req.getSuggestName());
                r.setSuggestRelationship(req.getSuggestRelationship());
                r.setSuggestNumber(req.getSuggestNumber());
                r.setSuggestEmail(req.getSuggestEmail());
                // save 안 해도 JPA dirty checking 으로 자동 update
            }
        }
        trustProfileService.recalcAndPersist(buyerId);
    }

    public List<SuggestRes> getSuggests(Long buyerId) {
        return suggestRepository.findByBuyerSuggest_BuyerId(buyerId)
                .stream()
                .map(SuggestRes::new)
                .toList();
    }

}
