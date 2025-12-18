package com.example.backend.controller;

import com.example.backend.controller.utility.ResponseController;
import com.example.backend.dto.AiProxyRequest;
import com.example.backend.dto.AiProxyResponse;
import com.example.backend.service.AiProxyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/proxy")
@RequiredArgsConstructor
public class AiProxyController {

    private final AiProxyService aiProxyService;

    @PostMapping
    public ResponseEntity<?> proxy(@RequestBody AiProxyRequest request) {
        try {
            AiProxyResponse response = aiProxyService.send(request);
            return ResponseController.success(response);
        } catch (Exception e) {
            return ResponseController.fail(e);
        }
    }
}
