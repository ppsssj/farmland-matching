package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity.License;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.entity.Suggest;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public record ApplicantsDetailRes(
        Long buyerId,
        String buyerName,
        String buyerNumber,
        String oneIntroduction, //oneIntro
        String introduction, //Intro
        String videoURL, //introURL
        List<String> interestCrop, //crops
        String experience, //exp
        List<String> equipment, //gears
        List<String> wantTrade, //trades
        List<String> suggests, //suggestNames
        List<String> licenses, //licenseNames
        Integer trustScore,
        MatchStatus matchStatus
) {
    public static ApplicantsDetailRes of(MatchingInfo mi) {

        Buyer b  = mi.getBuyerMatch();           // 네 필드명에 맞게
        TrustProfile tp = (b != null) ? b.getTrustProfile() : null;

        List<String> licenseNames =
                (b != null && b.getLicenseList() != null)
                        ? b.getLicenseList().stream()
                        .map(License::getLicenseName)
                        .distinct()
                        .collect(Collectors.toCollection(ArrayList::new)) // ArrayList로 수집
                        : new ArrayList<>();

        List<String> suggestNames =
                (b != null && b.getLicenseList() != null)
                        ? b.getSuggestList().stream()
                        .map(Suggest::getSuggestName)
                        .distinct()
                        .collect(Collectors.toCollection(ArrayList::new)) // ArrayList로 수집
                        : new ArrayList<>();

        // 관심 작물/장비/거래 형태는 JSONB 배열이나 1:N일 수 있음.
        // 네 엔티티에 맞춰 꺼내면 됨 (아래는 예시)
        //장비
        List<String> gears =
                (tp != null && tp.getEquipment() != null)
                        ? new ArrayList<>(tp.getEquipment())
                        : new ArrayList<>();

        List<String> crops =
                (tp != null && tp.getInterestCrop() != null)
                        ? new ArrayList<>(tp.getInterestCrop())
                        : new ArrayList<>();

        List<String> trades =
                (tp != null && tp.getWantTrade() != null)
                        ? new ArrayList<>(tp.getWantTrade())
                        : new ArrayList<>();

        String intro = (tp != null) ? tp.getIntroduction() : null;
        String oneIntro = (tp != null) ? tp.getOneIntroduction() : null;
        String introURL = (tp != null) ? tp.getVideoURL() : null;
        String exp = (tp != null) ? tp.getExperience() : null;

        return new ApplicantsDetailRes(
                b.getBuyerId(),
                b.getBuyerName(),
                b.getBuyerNumber(),
                oneIntro,
                intro,
                introURL,
                crops,
                exp,
                gears,
                trades,
                suggestNames,
                licenseNames,
                b.getTrustScore(),
                mi.getMatchStatus()
        );
    }
}
