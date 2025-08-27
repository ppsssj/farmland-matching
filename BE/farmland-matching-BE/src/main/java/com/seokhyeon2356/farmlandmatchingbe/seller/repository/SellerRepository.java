package com.seokhyeon2356.farmlandmatchingbe.seller.repository;

import com.seokhyeon2356.farmlandmatchingbe.seller.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {
    boolean existsBySellerNameAndSellerYear(String sellerName, int sellerYear);
}
