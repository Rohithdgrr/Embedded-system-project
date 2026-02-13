package com.examshield.controller;

import com.examshield.dto.*;
import com.examshield.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {
    
    private final ReportService reportService;
    
    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionReportDTO> getSessionReport(@PathVariable Long sessionId) {
        return ResponseEntity.ok(reportService.generateReport(sessionId));
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }
}
