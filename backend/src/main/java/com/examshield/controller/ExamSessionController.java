package com.examshield.controller;

import com.examshield.dto.*;
import com.examshield.service.ExamSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
public class ExamSessionController {
    
    private final ExamSessionService examSessionService;
    
    @PostMapping
    public ResponseEntity<ExamSessionDTO> createSession(@Valid @RequestBody CreateSessionRequest request) {
        ExamSessionDTO session = examSessionService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }
    
    @GetMapping
    public ResponseEntity<List<ExamSessionDTO>> getAllSessions() {
        return ResponseEntity.ok(examSessionService.getAllSessions());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ExamSessionDTO>> getActiveSessions() {
        return ResponseEntity.ok(examSessionService.getActiveSessions());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExamSessionDTO> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(examSessionService.getSessionById(id));
    }
    
    @PostMapping("/{id}/start")
    public ResponseEntity<ExamSessionDTO> startSession(@PathVariable Long id, @RequestParam(required = false) String streamUrl) {
        return ResponseEntity.ok(examSessionService.startSession(id, streamUrl));
    }
    
    @PostMapping("/{id}/pause")
    public ResponseEntity<ExamSessionDTO> pauseSession(@PathVariable Long id) {
        return ResponseEntity.ok(examSessionService.pauseSession(id));
    }
    
    @PostMapping("/{id}/resume")
    public ResponseEntity<ExamSessionDTO> resumeSession(@PathVariable Long id) {
        return ResponseEntity.ok(examSessionService.resumeSession(id));
    }
    
    @PostMapping("/{id}/end")
    public ResponseEntity<ExamSessionDTO> endSession(@PathVariable Long id) {
        return ResponseEntity.ok(examSessionService.endSession(id));
    }
    
    @PutMapping("/{id}/headcount")
    public ResponseEntity<ExamSessionDTO> updateHeadCount(@PathVariable Long id, @RequestParam Integer count) {
        return ResponseEntity.ok(examSessionService.updateHeadCount(id, count));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        examSessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}
