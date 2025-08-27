package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class LicenseReq {
    private Long licenseId;
    private String licenseName;
    private MultipartFile licenseFile;
    private Boolean removeFile;
}
