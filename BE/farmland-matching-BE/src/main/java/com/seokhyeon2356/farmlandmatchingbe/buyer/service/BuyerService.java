package com.seokhyeon2356.farmlandmatchingbe.buyer.service;

import com.seokhyeon2356.farmlandmatchingbe.buyer.dto.BuyerRequestDto;
import com.seokhyeon2356.farmlandmatchingbe.buyer.dto.BuyerResDto;
import com.seokhyeon2356.farmlandmatchingbe.buyer.dto.BuyerUpdateReq;
import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.repository.BuyerRepository;
import com.seokhyeon2356.farmlandmatchingbe.supabase.service.SupabaseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class BuyerService {

    private final SupabaseService supabaseService;
    private final BuyerRepository buyerRepository;

    public Long saveBuyerProfile(BuyerRequestDto buyerRequestDto) throws IOException {

        String buyerImageUrl = supabaseService.uploadFile(buyerRequestDto.getBuyerImage());

        Buyer buyer = Buyer.builder()
                .buyerName(buyerRequestDto.getBuyerName())
                .buyerAge(buyerRequestDto.getBuyerAge())
                .buyerGender(buyerRequestDto.getBuyerGender())
                .buyerAddress(buyerRequestDto.getBuyerAddress())
                .buyerLat(buyerRequestDto.getBuyerLat())
                .buyerLng(buyerRequestDto.getBuyerLng())
                .buyerNumber(buyerRequestDto.getBuyerNumber())
                .buyerEmail(buyerRequestDto.getBuyerEmail())
                .buyerImage(buyerImageUrl)
                .build();

        buyerRepository.save(buyer);

        return buyer.getBuyerId();
    }

    public BuyerResDto getBuyerProfile(Long buyerId) {

        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        return new BuyerResDto(buyer);
    }

    @Transactional
    public void updateBuyerProfile(Long buyerId, BuyerUpdateReq buyerUpdateReq) throws IOException {

        String buyerUpdateImageUrl = supabaseService.uploadFile(buyerUpdateReq.getBuyerImage());

        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        if (buyerUpdateReq.getBuyerName() != null) {
            buyer.setBuyerName(buyerUpdateReq.getBuyerName());
        }
        if (buyerUpdateReq.getBuyerAge() != null) {
            buyer.setBuyerAge(buyerUpdateReq.getBuyerAge());
        }
        if (buyerUpdateReq.getBuyerGender() != null) {
            buyer.setBuyerGender(buyerUpdateReq.getBuyerGender());
        }
        if (buyerUpdateReq.getBuyerNumber() != null) {
            buyer.setBuyerNumber(buyerUpdateReq.getBuyerNumber());
        }
        if (buyerUpdateReq.getBuyerEmail() != null) {
            buyer.setBuyerEmail(buyerUpdateReq.getBuyerEmail());
        }
        if (buyerUpdateReq.getBuyerAddress() != null) {
            buyer.setBuyerAddress(buyerUpdateReq.getBuyerAddress());
        }
        if (buyerUpdateReq.getBuyerLat() != null) {
            buyer.setBuyerLat(buyerUpdateReq.getBuyerLat());
        }
        if (buyerUpdateReq.getBuyerLng() != null) {
            buyer.setBuyerLng(buyerUpdateReq.getBuyerLng());
        }
        if (buyerUpdateReq.getBuyerImage() != null) {
            buyer.setBuyerImage(buyerUpdateImageUrl);
        }
    }
}
