package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.repository;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrustProfileRepository extends JpaRepository<TrustProfile, Long> {

    // buyerId로 TrustProfile 단건 조회 (unique 가정)
    @Query("""
        select tp
        from TrustProfile tp
        join fetch tp.buyerTrustProfile b
        where b.buyerId = :buyerId
    """)
    Optional<TrustProfile> findByBuyerId(@Param("buyerId") Long buyerId);

    @Query("""
      select tp from TrustProfile tp
      join fetch tp.buyerTrustProfile b
      where b.buyerId = :buyerId
    """)
    Optional<TrustProfile> findByBuyerIdFetch(@Param("buyerId") Long buyerId);
}

