package com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.suggest.entity;

import com.seokhyeon2356.farmlandmatchingbe.buyer.entity.Buyer;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.entity.TrustProfile;
import com.seokhyeon2356.farmlandmatchingbe.buyer.trustProfile.license.entity.License;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "suggest")
public class Suggest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suggest_id")
    private Long suggestId;

    @Column(name = "suggest_name")
    private String suggestName;

    @Column(name = "suggest_relationship")
    private String suggestRelationship;

    @Column(name = "suggest_number")
    private String suggestNumber;

    private String suggestEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyerId")
    private Buyer buyerSuggest;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Suggest other = (Suggest) o;
        return suggestId != null && Objects.equals(suggestId, other.suggestId);
    }
    @Override
    public int hashCode() { return getClass().hashCode(); }
}
