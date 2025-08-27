package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.service;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.repository.BuyerRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.ItemRow;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.TrustProfileReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.TrustProfileRes;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.dto.TrustScore;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.repo.LicenseRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.repository.TrustProfileRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.repo.SuggestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrustProfileService {

    private final TrustProfileRepository trustProfileRepository;
    private final BuyerRepository buyerRepository;
    private final LicenseRepository licenseRepository;
    private final SuggestRepository suggestRepository;

    /**
     * 저장(Upsert):
     * - buyerId로 TrustProfile 존재하면 → 전체 필드 덮어쓰기(프론트에서 온 리스트가 정답)
     * - 없으면 → 새로 만들기 + 연관관계 세팅
     */
    @Transactional
    public Long saveTrustProfile(Long buyerId, TrustProfileReq req) {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found: " + buyerId));

        TrustProfile tp = trustProfileRepository.findByBuyerId(buyerId)
                .orElseGet(() -> {
                    TrustProfile created = new TrustProfile();
                    // ★ 연관관계 주인(TrustProfile) 쪽 FK 세팅
                    created.setBuyerTrustProfile(buyer);
                    return created;
                });

        // === 프론트에서 보낸 값으로 '통째로' 덮어쓰기 ===
        tp.setInterestCrop(req.getInterestCrop());
        tp.setEquipment(req.getEquipment());
        tp.setWantTrade(req.getWantTrade());
        tp.setRentPeriod(req.getRentPeriod());
        tp.setOther(req.getOther());
        tp.setAwards(req.getAwards());
        tp.setExperience(req.getExperience());
        tp.setExperiencePeriod(req.getExperiencePeriod());
        tp.setExperienceDetail(req.getExperienceDetail());
        tp.setBudget(req.getBudget());
        tp.setWantPeriod(req.getWantPeriod());
        tp.setOneIntroduction(req.getOneIntroduction());
        tp.setIntroduction(req.getIntroduction());
        tp.setVideoURL(req.getVideoURL());
        tp.setSns(req.getSns());
        tp.setPersonal(req.getPersonal());
        //tp.setTrustScore(req.getTrustScore()); // 쓰는 중이면 포함

        // 새로 생성된 경우에는 persist, 기존이면 merge감지로 update
        TrustProfile saved = trustProfileRepository.save(tp);
        recalcAndPersist(buyerId);
        return saved.getTrustId();
    }

    /**
     * 조회: buyerId로 조회하여 화면에 다시 뿌리기
     */
    @Transactional
    public TrustProfileRes getTrustProfile(Long buyerId) {
        TrustProfile tp = trustProfileRepository.findByBuyerId(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 프로필(buyerId=" + buyerId + ")을 찾을 수 없습니다."));
        return new TrustProfileRes(tp);
    }

    //신뢰 점수
    @Transactional
    public TrustScore compute(Long buyerId) {

        TrustProfile profile = trustProfileRepository.findByBuyerId(buyerId)
                .orElseThrow(() -> new RuntimeException("프로필 없음"));

        int licCnt = licenseRepository.countByBuyerId(buyerId);
        int suggestCnt = suggestRepository.countByBuyerId(buyerId);

        var tp = trustProfileRepository.findByBuyerIdFetch(buyerId).orElse(null);

        boolean hasSns = tp != null && tp.getSns() != null && !tp.getSns().isEmpty();
        boolean hasOneIntroduction = tp != null && tp.getOneIntroduction() != null && !tp.getOneIntroduction().isEmpty();
        boolean hasIntroduction = tp != null && tp.getIntroduction() != null && !tp.getIntroduction().isEmpty();

        int awardsCnt = profile.getAwards().size();
        int snsScore = hasSns ? 1 : 0;
        int oneIntroductionScore = hasOneIntroduction ? 1 : 0;
        int introductionScore = hasIntroduction ? 1 : 0;

        ItemRow licenseRow = new ItemRow("license", licCnt, 5, licCnt * 5);
        ItemRow suggestRow = new ItemRow("suggest", suggestCnt, 4, suggestCnt * 4);
        ItemRow awardsRow = new ItemRow("awards", awardsCnt, 7, awardsCnt * 7);
        ItemRow snsRow = new ItemRow("sns", snsScore, 10, snsScore * 10);
        ItemRow oneIntroductionRow = new ItemRow("oneIntroduction", oneIntroductionScore, 10, oneIntroductionScore * 10);
        ItemRow introductionRow = new ItemRow("introduction", introductionScore, 30, introductionScore * 30);

        int total = licenseRow.acquiredPoint()
                + suggestRow.acquiredPoint()
                + snsRow.acquiredPoint()
                + awardsRow.acquiredPoint()
                + oneIntroductionRow.acquiredPoint()
                + introductionRow.acquiredPoint();

        return new TrustScore(
                total,
                licenseRow,
                suggestRow,
                snsRow,
                awardsRow,
                oneIntroductionRow,
                introductionRow,
                licCnt,
                suggestCnt,
                awardsCnt,
                hasSns,
                hasOneIntroduction,
                hasIntroduction
        );
    }

    @Transactional
    public int recalcAndPersist(Long buyerId) {
        TrustScore b = compute(buyerId);
        Buyer buyer = buyerRepository.getReferenceById(buyerId);
        buyer.setTrustScore(b.total());
        return b.total();
    }
}
