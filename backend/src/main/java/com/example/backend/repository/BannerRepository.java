package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.banner.Banner;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByIsActiveTrueOrderByDisplayOrderAsc();

    List<Banner> findAllByOrderByDisplayOrderAsc();
}
