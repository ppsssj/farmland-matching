package com.seokhyeon2356.farmlandmatchingbe.farmland.repository;

import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.FarmlandListProjection;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.SellerFarmlandListRes;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FarmlandRepository extends JpaRepository<Farmland, Long> {

        // sellerId의 농지들 + 각 농지의 "가장 최근 MatchingInfo"의 status만 함께 선택
        @Query("""
           select new com.seokhyeon2356.farmlandmatchingbe.farmland.dto.SellerFarmlandListRes(
               f.landId, f.landName, f.landAddress, f.landCrop, f.landArea, mi.matchStatus
           )
           from Farmland f
             join f.sellerFarmland s
             left join MatchingInfo mi
               on mi.farmlandMatch = f
              and mi.matchingId = (
                    select max(mi2.matchingId)
                    from MatchingInfo mi2
                    where mi2.farmlandMatch = f
               )
           where s.sellerId = :sellerId
           order by f.landRegisterDate desc
           """)
        List<SellerFarmlandListRes> findAllFarmlandByseller(@Param("sellerId") Long sellerId);

    @Query(value = """
        select 
          f.land_id        as landId,
          f.landName       as landName,
          f.landCrop       as landCrop,
          f.landAddress    as landAddress,
          f.landArea       as landArea,
          f.landPrice      as landPrice,
          f.landLat        as landLat,
          f.landLng        as landLng,
          ams.aimatchscore as aiMatchScore
        from farmland f
        left join aimatchscore ams
          on ams.landid = f.land_id
         and ams.buyerid = :buyerId
        order by f.land_id
        """, nativeQuery = true)
    List<FarmlandListRow> findAllWithAiScore(@Param("buyerId") Long buyerId);
}

