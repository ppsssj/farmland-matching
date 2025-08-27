package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.controller;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto.LicenseReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto.LicenseReqList;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto.LicenseRes;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.service.LicenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class LicenseController {

    private final LicenseService licenseService;

    @PostMapping("/{buyerId}/license-save")
    public ResponseEntity<String> uploadLicense(@PathVariable Long buyerId,
                                                @ModelAttribute LicenseReqList wrapper) throws IOException {

        licenseService.saveLicense(buyerId, wrapper.getLicenseList());

        return ResponseEntity.ok("자격증등록완료");
    }

    @GetMapping("/{buyerId}/licenses")
    public List<LicenseRes> getLicenses(@PathVariable Long buyerId) {

        return licenseService.getLicenses(buyerId);
    }
}
