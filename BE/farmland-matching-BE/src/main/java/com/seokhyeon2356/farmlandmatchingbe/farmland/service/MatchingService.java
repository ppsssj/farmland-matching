package com.seokhyeon2356.farmlandmatchingbe.farmland.service;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.repository.BuyerRepository;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.MatchStatus;
import com.seokhyeon2356.farmlandmatchingbe.farmland.dto.MyAppliedLandDto;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo;
import com.seokhyeon2356.farmlandmatchingbe.farmland.repository.FarmlandRepository;
import com.seokhyeon2356.farmlandmatchingbe.farmland.repository.MatchingInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchingService {
    private final FarmlandRepository farmlandRepository;
    private final BuyerRepository buyerRepository;
    private final MatchingInfoRepository matchingInfoRepository;

    // 농지 신청 (buyer가 land에 지원)
    public Long apply(Long landId, Long buyerId) {
        Farmland farmland = farmlandRepository.findById(landId)
                .orElseThrow(() -> new IllegalArgumentException("농지를 찾을 수 없습니다. landId=" + landId));
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("신청자를 찾을 수 없습니다. buyerId=" + buyerId));

        // 이미 신청했는지 체크 (중복 방지)
        if (matchingInfoRepository.existsByFarmlandMatch_LandIdAndBuyerMatch_BuyerId(landId, buyerId)) {
            throw new IllegalStateException("이미 신청한 농지입니다.");
        }

        MatchingInfo mi = new MatchingInfo();
        mi.setFarmlandMatch(farmland);
        mi.setBuyerMatch(buyer);

        matchingInfoRepository.save(mi);
        return mi.getMatchingId();
    }

    //농지 신청 취소하기
    @Transactional
    public void cancelApply(Long landId, Long buyerId /*, Long authBuyerId */) {
        // (선택) 로그인 사용자 검증: if (!authBuyerId.equals(buyerId)) throw ...
        MatchingInfo mi = matchingInfoRepository
                .findByFarmlandMatch_LandIdAndBuyerMatch_BuyerId(landId, buyerId)
                .orElseThrow(() -> new IllegalArgumentException("신청 정보를 찾을 수 없습니다."));

        // 진행중일 때 삭제 금지 등의 정책이 있으면 여기서 검사
        if (mi.getMatchStatus() == MatchStatus.IN_PROGRESS) {
            throw new IllegalStateException("진행 중 매칭은 취소(삭제)할 수 없습니다.");
        }

        matchingInfoRepository.delete(mi);
    }

    //구매자가 신청한 농지 목록 조회
    public List<MyAppliedLandDto> listByBuyer(Long buyerId) {
        List<MatchingInfo> rows = matchingInfoRepository.findAllByBuyer(buyerId);
        return rows.stream().map(MyAppliedLandDto::from).toList();
    }

    //농지 즐겨찾기

}
