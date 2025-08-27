package com.seokhyeon2356.farmlandmatchingbe.buyer.controller;

import com.seokhyeon2356.farmlandmatchingbe.buyer.dto.BuyerRequestDto;
import com.seokhyeon2356.farmlandmatchingbe.buyer.dto.BuyerResDto;
import com.seokhyeon2356.farmlandmatchingbe.buyer.dto.BuyerUpdateReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.service.BuyerService;
import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BuyerController {

    private final BuyerService buyerService;

    @PostMapping("/buyer-upload")
    public ResponseEntity<Map<String,Object>> uploadBuyerProfile(@ModelAttribute BuyerRequestDto buyerRequestDto) throws IOException {

        Long buyerId = buyerService.saveBuyerProfile(buyerRequestDto);

        Map<String,Object> response = new HashMap<>();
        response.put("message","프로필 등록 완료");
        response.put("buyerId",buyerId);

        return ResponseEntity.ok(response);
    }

    //프로필 불러오기
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<BuyerResDto> getBuyer(@PathVariable Long buyerId) {

        BuyerResDto buyer = buyerService.getBuyerProfile(buyerId);
        return  ResponseEntity.ok(buyer);
    }

    //프로필 수정
    @PatchMapping("buyer-update/{buyerId}")
    public ResponseEntity<Map<String,Object>> updateBuyer(
            @PathVariable Long buyerId,
            @ModelAttribute BuyerUpdateReq buyerUpdateReq) throws IOException {

        buyerService.updateBuyerProfile(buyerId, buyerUpdateReq);

        Map<String,Object> response = new HashMap<>();
        response.put("message", "구매자 정보 수정 완료");
        response.put("buyerId",buyerId);

        return ResponseEntity.ok(response);
    }

}
