package com.example.backend.entity.board;

import java.util.List;

import com.example.backend.entity.board.details.FavoriteBoard;
import com.example.backend.entity.board.details.RecentBoard;
import com.example.backend.entity.board.enums.BoardEnum;
import com.example.backend.entity.user.User;
import com.example.backend.entity.utility.BaseEntity;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter

@Entity
public class Board extends BaseEntity{

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
    @Enumerated(EnumType.STRING)
    private BoardEnum boardType;
    @Column
    private String title;
    @Column
    private String content;
    @Column
    private Boolean secretYn; // 비밀 글 여부

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FavoriteBoard> favoriteBoardList;
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecentBoard> recentBoardList;
}
