package com.seokhyeon2356.farmlandmatchingbe.ai.repo;

import com.seokhyeon2356.farmlandmatchingbe.ai.entity.AiMatchScore;
import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiMatchScoreRepo extends JpaRepository<AiMatchScore, Long> {
    Optional<AiMatchScore> findByLandIdAndBuyerId(Long landId, Long buyerId);
}
