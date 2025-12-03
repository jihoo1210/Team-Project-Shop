package com.example.backend.entity.item.details;

import com.example.backend.entity.item.Item;
import com.example.backend.entity.item.enums.ColorEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter

@Entity
public class Color {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Item과의 연관관계 매핑(@ManyToOne, @JoinColumn 등) 올바른지 확인
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
    
    @Enumerated(EnumType.STRING)
    private ColorEnum color;

    // Builder 사용 시 필수값 누락 방지 필요
    // 컬렉션 필드가 있을 경우 초기화 및 null 체크 필요
}
