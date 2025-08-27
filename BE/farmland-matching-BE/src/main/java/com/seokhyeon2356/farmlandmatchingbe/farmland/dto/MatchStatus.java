package com.seokhyeon2356.farmlandmatchingbe.farmland.dto;

public enum MatchStatus {

    WAITING("매칭 대기중"),
    IN_PROGRESS("매칭 진행중"),
    REJECTED("매칭 거절됨");

    private final String label;
    MatchStatus(String label) {
        this.label = label;
    }
    public String label() {

        return label;
    }
}
