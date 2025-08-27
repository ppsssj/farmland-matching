package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LicenseReqList {
    private List<LicenseReq> licenseList = new ArrayList<>();
}
