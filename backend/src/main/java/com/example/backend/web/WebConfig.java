package com.example.backend.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${whop.key}")
    private String whopKey;

    @Value("${upload-dir}")
    private String uploadDir;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer" + whopKey)
        .baseUrl("https://api.whop.com/api/v1")
        .build();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // React 개발 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 상품 이미지 정적 리소스 매핑
        registry.addResourceHandler("/product/**")
                .addResourceLocations("file:" + uploadDir + "/");

        // 배너 이미지 정적 리소스 매핑
        registry.addResourceHandler("/banner/**")
                .addResourceLocations("file:" + uploadDir + "/banner/");
    }
}
