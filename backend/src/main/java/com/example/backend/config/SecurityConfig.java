package com.example.backend.config;

import com.example.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 사용 안함
            )
            .authorizeHttpRequests(auth -> auth
                // 🔴 관리자 전용 API
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // 🟢 인증 없이 접근 가능한 엔드포인트
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/board/list", "/api/board/{boardNo}").permitAll()
                .requestMatchers("/api/board/image/**").permitAll()
                .requestMatchers("/api/comments/board/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                
                // 🟢 상품/리뷰 조회는 누구나 (GET만)
                .requestMatchers(HttpMethod.GET, "/api/item").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/item/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/review").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/review/**").permitAll()
                
                // 🔴 그 외는 로그인 필요
                .anyRequest().authenticated()
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) // H2 콘솔용
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            // JWT 필터 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization")); // JWT 토큰 헤더 노출
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
