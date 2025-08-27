package com.seokhyeon2356.farmlandmatchingbe.seller.entity;

import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.Farmland;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "seller",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"sellerName", "sellerYear"})
        }
)
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    @Column(nullable = false)
    private String sellerName;
    @Column(nullable = false)
    private Integer sellerYear;
    @Column(nullable = false)
    private String sellerNumber;
    @Column(nullable = false)
    private String sellerAddress;
    @Column(nullable = false)
    private Integer sellerLand;
    @OneToMany(mappedBy = "sellerFarmland")
    private List<Farmland> farmlands = new ArrayList<>();
}
