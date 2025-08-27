package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.service;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.repository.BuyerRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto.LicenseRes;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.repo.LicenseRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto.LicenseReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity.License;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.repository.TrustProfileRepository;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.service.TrustProfileService;
import com.seokhyeon2356.farmlandmatchingbe.supabase.service.SupabaseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LicenseService {

    private final LicenseRepository licenseRepository;
    private final SupabaseService supabaseService;
    private final BuyerRepository buyerRepository;
    private final TrustProfileService trustProfileService;

    @Transactional
    public List<LicenseRes> saveLicense(Long buyerId, List<LicenseReq> requestList) throws IOException {
        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found: " + buyerId));

        List<License> existing = licenseRepository.findByBuyerLicense_BuyerId(buyerId);
        Map<Long, License> byId = existing.stream()
                .collect(Collectors.toMap(License::getLicenseId, l -> l));
        // 이름으로도 찾을 수 있게 인덱스 (id가 누락될 수 있으므로)
        Map<String, License> byName = existing.stream()
                .collect(Collectors.toMap(License::getLicenseName, l -> l, (a, b) -> a));

        List<License> toPersist = new ArrayList<>();
        Set<Long> seenIds = new HashSet<>();

        for (LicenseReq req : requestList) {
            License target = null;

            // 1) id로 먼저 매칭
            if (req.getLicenseId() != null) {
                target = byId.get(req.getLicenseId());
                if (target == null)
                    throw new IllegalArgumentException("License not found: id=" + req.getLicenseId());
                seenIds.add(target.getLicenseId());
            }
            // 2) id가 없으면 이름으로 매칭(같은 이름이면 업데이트로 간주)
            else if (req.getLicenseName() != null) {
                target = byName.get(req.getLicenseName());
                if (target != null) seenIds.add(target.getLicenseId());
            }

            if (target == null) {
                // 정말 신규
                target = License.builder()
                        .buyerLicense(buyer)
                        .build();
            }

            // 공통: 필드 반영
            target.setLicenseName(req.getLicenseName());

            // 파일은 새 파일 있을 때만 교체, 없으면 유지
            if (hasRealFile(req.getLicenseFile())) {
                String newUrl = supabaseService.uploadFile(req.getLicenseFile());
                if (newUrl != null && !newUrl.isBlank()) {
                    // 필요 시 기존 파일 삭제 로직
                    // supabaseService.deleteFileByUrl(target.getLicenseFile());
                    target.setLicenseFile(newUrl);
                }
            }

            toPersist.add(target);
        }

        // 요청에 없는 기존 항목 삭제
        List<License> toDelete = existing.stream()
                .filter(l -> l.getLicenseId() != null && !seenIds.contains(l.getLicenseId()))
                .toList();
        if (!toDelete.isEmpty()) licenseRepository.deleteAllInBatch(toDelete);

        List<License> saved = licenseRepository.saveAll(toPersist);
        trustProfileService.recalcAndPersist(buyerId);
        return saved.stream().map(LicenseRes::new).toList();
    }

    private boolean hasRealFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return false;
        try {
            // 일부 프론트가 "null" 문자열을 파일처럼 보낼 수 있음 → 무시
            if (file.getSize() <= 16) {
                String body = new String(file.getBytes(), java.nio.charset.StandardCharsets.UTF_8);
                if ("null".equalsIgnoreCase(body.trim())) return false;
            }
        } catch (IOException ignore) { }
        return true;
    }

    public List<LicenseRes> getLicenses(Long buyerId) {

        return licenseRepository.findByBuyerLicense_BuyerId(buyerId).stream()
                .map(LicenseRes::new)
                .toList();
    }
}
