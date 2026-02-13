package com.examshield.controller;

import com.examshield.dto.RealTimeDetectionDTO;
import com.examshield.service.DetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final DetectionService detectionService;
    
    @MessageMapping("/detections")
    @SendTo("/topic/detections")
    public RealTimeDetectionDTO handleDetection(RealTimeDetectionDTO detectionDTO) {
        log.debug("Received detection from session: {}", detectionDTO.getSessionId());
        
        if (detectionDTO.getDetections() != null && !detectionDTO.getDetections().isEmpty()) {
            for (RealTimeDetectionDTO.DetectionResult detection : detectionDTO.getDetections()) {
                try {
                    detectionService.processDetection(detectionDTO.getSessionId(), detection);
                } catch (Exception e) {
                    log.error("Error processing detection: {}", e.getMessage());
                }
            }
        }
        
        if (detectionDTO.getHeadCount() != null) {
            detectionService.updateHeadCount(detectionDTO.getSessionId(), detectionDTO.getHeadCount().getDetected());
        }
        
        RealTimeDetectionDTO.SessionStats stats = detectionService.calculateSessionStats(detectionDTO.getSessionId());
        detectionDTO.setSessionStats(stats);
        
        return detectionDTO;
    }
    
    public void broadcastDetection(RealTimeDetectionDTO detectionDTO) {
        messagingTemplate.convertAndSend("/topic/detections", detectionDTO);
        messagingTemplate.convertAndSend("/topic/session/" + detectionDTO.getSessionId(), detectionDTO);
    }
    
    public void broadcastAlert(Long sessionId, String alertMessage, String alertLevel) {
        messagingTemplate.convertAndSend("/topic/alerts/" + sessionId, 
                java.util.Map.of("message", alertMessage, "level", alertLevel));
    }
}
