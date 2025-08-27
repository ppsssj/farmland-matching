package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.repo;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
    List<License> findByBuyerLicense_BuyerId(Long buyerId);

    @Query("select count(l) from License l where l.buyerLicense.buyerId = :buyerId")
    int countByBuyerId(@Param("buyerId") Long buyerId);
}

