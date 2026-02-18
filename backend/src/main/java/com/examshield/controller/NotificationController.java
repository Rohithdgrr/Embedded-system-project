package com.examshield.controller;

import com.examshield.dto.NotificationRequest;
import com.examshield.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    
    private final NotificationService notificationService;
    
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendNotification(@RequestBody NotificationRequest request) {
        log.info("Received notification request to: {}", request.getTo());
        
        try {
            boolean queued = notificationService.queueEmail(request);
            
            if (queued) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification queued successfully",
                    "queueStatus", notificationService.getQueueStatus()
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Failed to send email"
                ));
            }
        } catch (Exception e) {
            log.error("Error sending notification: ", e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/violation")
    public ResponseEntity<Map<String, Object>> sendViolationAlert(
            @RequestParam String[] to,
            @RequestParam String violationType,
            @RequestParam String seat,
            @RequestParam double confidence) {
        
        log.info("Sending violation alert: {} at {} to {}", violationType, seat, to);
        
        boolean queued = notificationService.sendViolationAlert(to, violationType, seat, confidence);
        
        return ResponseEntity.ok(Map.of(
            "success", queued,
            "message", queued ? "Violation alert queued" : "Failed to queue alert",
            "queueStatus", notificationService.getQueueStatus()
        ));
    }
}
