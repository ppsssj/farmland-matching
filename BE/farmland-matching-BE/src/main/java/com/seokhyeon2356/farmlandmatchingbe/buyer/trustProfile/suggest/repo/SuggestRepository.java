package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.repo;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.entity.Suggest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SuggestRepository extends JpaRepository<Suggest, Long> {

    List<Suggest> findByBuyerSuggest_BuyerId(Long buyerId);

    @Query("select count(sg) from Suggest sg where sg.buyerSuggest.buyerId = :buyerId")
    int countByBuyerId(@Param("buyerId") Long buyerId);
}
