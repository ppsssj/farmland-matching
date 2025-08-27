package com.seokhyeon2356.farmlandmatchingbe.seller.controller;

import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerRequestDto;
import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerResponseDto;
import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerUpdateRequestDto;
import com.seokhyeon2356.farmlandmatchingbe.seller.service.SellerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class SellerController {

    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {

        this.sellerService = sellerService;
    }

    @PostMapping("/seller-upload")
    public ResponseEntity<Map<String, Object>> createSeller(@RequestBody SellerRequestDto sellerRequestDto) {

        try {
            Long sellerId = sellerService.createSeller(sellerRequestDto);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "판매자 등록 완료");
            response.put("seller_id", sellerId);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/seller/{seller_id}")
    public ResponseEntity<SellerResponseDto> getSeller(@PathVariable("seller_id") long sellerId) {

        SellerResponseDto seller = sellerService.getSellerById(sellerId);
        return  ResponseEntity.ok(seller);
    }

    @PatchMapping("/seller-update/{seller_id}")
    public ResponseEntity<Map<String,Object>> updateSeller(
            @PathVariable("seller_id") long sellerId,
            @RequestBody SellerUpdateRequestDto updateDto) {

        sellerService.updateSeller(sellerId, updateDto);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "판매자 정보 수정 완료");
        response.put("seller_id", sellerId);

        return ResponseEntity.ok(response);
    }
}
