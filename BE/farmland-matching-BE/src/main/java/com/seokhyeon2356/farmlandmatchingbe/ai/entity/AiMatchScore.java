package com.seokhyeon2356.farmlandmatchingbe.ai.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@Setter
@Table(
        name = "aimatchscore",
        uniqueConstraints = @UniqueConstraint(columnNames = {"landId","buyerId"})
)
public class AiMatchScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aimatchscoreid")
    private Long aiMatchScoreId;

    @Column(name = "aimatchscore")
    private Double aiMatchScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "aiscoredetail")
    private JsonNode aiScoreDetail;

    @Column(name = "landid")
    private Long landId;

    @Column(name = "buyerid")
    private Long buyerId;
}
