package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "license")
public class License {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long licenseId;
    private String licenseName;

    //s3 저장소에서 URL로 저장받아올거임
    private String licenseFile;

    //추후 추가 예정
    //@Column(name = "acquired_date")
    //private String acquiredDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerId")
    private Buyer buyerLicense;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        License other = (License) o;
        return licenseId != null && Objects.equals(licenseId, other.licenseId);
    }
    @Override
    public int hashCode() { return getClass().hashCode(); }
}
