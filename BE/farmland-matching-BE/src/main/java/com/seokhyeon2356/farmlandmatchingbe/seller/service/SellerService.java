package com.seokhyeon2356.farmlandmatchingbe.seller.service;

import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerRequestDto;
import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerResponseDto;
import com.seokhyeon2356.farmlandmatchingbe.seller.dto.SellerUpdateRequestDto;
import com.seokhyeon2356.farmlandmatchingbe.seller.entity.Seller;
import com.seokhyeon2356.farmlandmatchingbe.seller.repository.SellerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository) {

        this.sellerRepository = sellerRepository;
    }

    public Long createSeller(SellerRequestDto sellerRequestDto) {

        System.out.println("[DEBUG] createSeller 호출됨: "
                + sellerRequestDto.getSellerName() + ", "
                + sellerRequestDto.getSellerYear());

        boolean exists = sellerRepository.existsBySellerNameAndSellerYear(
                sellerRequestDto.getSellerName(),
                sellerRequestDto.getSellerYear()
        );
        if (exists) {
            throw new IllegalArgumentException("이미 같은 이름과 연도의 판매자가 존재합니다.");
        }

        Seller seller = Seller.builder()
                .sellerName(sellerRequestDto.getSellerName())
                .sellerYear(sellerRequestDto.getSellerYear())
                .sellerNumber(sellerRequestDto.getSellerNumber())
                .sellerAddress(sellerRequestDto.getSellerAddress())
                .sellerLand(sellerRequestDto.getSellerLand())
                .build();

        System.out.println("[DEBUG] DB 저장 시도: "
                + seller.getSellerName() + ", "
                + seller.getSellerYear());

        sellerRepository.save(seller);

        return seller.getSellerId();
    }

    public SellerResponseDto getSellerById(Long sellerId) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 판매자를 찾을 수 없습니다."));

        return new SellerResponseDto(seller);
    }

    @Transactional
    public void updateSeller(Long sellerId, SellerUpdateRequestDto dto) {
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 판매자가 없습니다."));

        // null이 아닌 값만 업데이트
        if (dto.getSellerName() != null) {
            seller.setSellerName(dto.getSellerName());
        }
        if (dto.getSellerYear() != null) {
            seller.setSellerYear(dto.getSellerYear());
        }
        if (dto.getSellerNumber() != null) {
            seller.setSellerNumber(dto.getSellerNumber());
        }
        if (dto.getSellerAddress() != null) {
            seller.setSellerAddress(dto.getSellerAddress());
        }
        if (dto.getSellerLand() != null) {
            seller.setSellerLand(dto.getSellerLand());
        }
    }

}
