package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto;

import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity.License;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class LicenseRes {

    private String licenseName;
    private String licenseFile;

    public LicenseRes(License license) {

        this.licenseName = license.getLicenseName();
        this.licenseFile = license.getLicenseFile();
    }
}
