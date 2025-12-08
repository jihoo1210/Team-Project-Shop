package com.example.backend.entity.item.details;

import java.util.List;

import com.example.backend.entity.item.Item;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter

@Entity
public class ItemImage {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Item item;
    @Column
    private String imageUrl;

    // Item과의 연관관계 매핑(@ManyToOne, @JoinColumn 등) 올바른지 확인
    // Builder 사용 시 필수값 누락 방지 필요
    // 컬렉션 필드가 있을 경우 초기화 및 null 체크 필요
}
