package com.seokhyeon2356.farmlandmatchingbe.buyer.entity;

import com.seokhyeon2356.farmlandmatchingbe.ai.entity.AiMatchScore;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity.License;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.entity.Suggest;
import com.seokhyeon2356.farmlandmatchingbe.farmland.entity.MatchingInfo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        name = "buyer",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"buyerName","buyerNumber"})
        }
)
public class Buyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long buyerId;

    private String buyerName;
    private Integer buyerAge;
    private String buyerGender;
    private String buyerAddress;
    private Double buyerLat;
    private Double buyerLng;
    private String buyerNumber;
    private String buyerEmail;
    private String buyerImage;
    private Integer trustScore;

    @OneToOne(mappedBy = "buyerTrustProfile", cascade = CascadeType.ALL)
    private TrustProfile trustProfile;

    @OneToMany(mappedBy = "buyerMatch")
    private List<MatchingInfo> buyerInfo =  new ArrayList<>();

    @OneToMany(mappedBy = "buyerLicense", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<License> licenseList = new LinkedHashSet<>();

    @OneToMany(mappedBy = "buyerSuggest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private Set<Suggest> suggestList = new LinkedHashSet<>();
}
