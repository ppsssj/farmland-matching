package com.seokhyeon2356.farmlandmatchingbe.farmland.repository;

import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo; // ← 패키지 정확히!
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface MatchingInfoRepository extends JpaRepository<MatchingInfo, Long> {

    // 농지 상세 화면의 신청자 목록 (N+1 방지: buyer를 fetch join)
    @Query("select mi from MatchingInfo mi " +
            "join fetch mi.buyerMatch b " +
            "where mi.farmlandMatch.landId = :landId " +
            "order by mi.matchingId desc")
    List<MatchingInfo> findAllBuyerByLandId(@Param("landId") Long landId);

    @Query("""
    select distinct mi
    from MatchingInfo mi
    join fetch mi.buyerMatch b
    left join fetch b.trustProfile tp
    left join fetch b.licenseList lic
    where mi.farmlandMatch.landId = :landId
      and b.buyerId = :buyerId
    """)
    Optional<MatchingInfo> findDetailBuyerInfoAndTrustAndLicenses(
            @Param("landId") Long landId, @Param("buyerId") Long buyerId);

    boolean existsByFarmlandMatch_LandIdAndBuyerMatch_BuyerId(Long landId, Long buyerId);

    Optional<MatchingInfo> findByFarmlandMatch_LandIdAndBuyerMatch_BuyerId(Long landId, Long buyerId);

    @Query("""
       select mi from MatchingInfo mi
       join fetch mi.farmlandMatch f
       where mi.buyerMatch.buyerId = :buyerId
       order by mi.matchingId desc
    """)
    List<MatchingInfo> findAllByBuyer(@Param("buyerId") Long buyerId);

    @Query("""
       select mi from MatchingInfo mi
       join fetch mi.buyerMatch b
       where mi.farmlandMatch.landId = :landId and mi.matchStatus = 'WAITING'
       order by mi.matchingId desc
    """)
    List<MatchingInfo> findRequestedByLand(@Param("landId") Long landId, Pageable pageable);
}
