package com.seokhyeon2356.farmlandmatchingbe.ai.dto;

import lombok.Data;

@Data
public class SnycRequest {
    private long buyerId;
    private int topK;
}
