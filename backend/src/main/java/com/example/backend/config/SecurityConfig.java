package com.example.backend.config;

// =====================================================
// [종혁 코드] + [진용 코드] 통합
// =====================================================

import com.example.backend.oauth.OAuth2SuccessHandler;
import com.example.backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

    // =====================================================
    // [종혁 코드] - JWT 필터 주입
    // =====================================================
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // =====================================================
    // [진용 추가] - OAuth2 성공 핸들러 주입
    // =====================================================
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    // =====================================================
    // [종혁 코드] - 비밀번호 인코더
    // =====================================================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // =====================================================
            // [종혁 코드] - CORS 설정
            // =====================================================
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            // =====================================================
            // [종혁 코드] - 세션 사용 안함 (JWT 사용)
            // =====================================================
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // =====================================================
            // [진용 코드] - 접근 권한 설정 (기존 + 종혁 코드 참고)
            // =====================================================
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/error").permitAll()
                .requestMatchers("/login/success", "/login/failure").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()  // OAuth2 관련 경로
                .requestMatchers("/api/auth/**").permitAll()  // [종혁 코드] 인증 API
                .requestMatchers("/h2-console/**").permitAll()  // [종혁 코드] H2 콘솔
                .anyRequest().authenticated()
            )

            // =====================================================
            // [진용 코드] - OAuth2 로그인 설정 (JWT 발급 핸들러 연결)
            // =====================================================
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)  // JWT 토큰 발급
                .failureUrl("/login/failure")
            )

            // =====================================================
            // [종혁 코드] - 폼 로그인, HTTP Basic 비활성화
            // =====================================================
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // =====================================================
            // [종혁 코드] - JWT 필터 추가
            // =====================================================
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

            // =====================================================
            // [진용 코드] - 로그아웃 설정
            // =====================================================
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .deleteCookies("accessToken", "refreshToken")  // JWT 쿠키 삭제
                .permitAll()
            );

        return http.build();
    }

    // =====================================================
    // [종혁 코드] - CORS 설정
    // =====================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}