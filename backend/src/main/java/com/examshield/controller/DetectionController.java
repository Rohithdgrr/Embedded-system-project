package com.examshield.controller;

import com.examshield.dto.*;
import com.examshield.service.DetectionService;
import com.examshield.service.VideoProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/detect")
@RequiredArgsConstructor
@Slf4j
public class DetectionController {
    
    private final DetectionService detectionService;
    private final VideoProcessingService videoProcessingService;
    
    @PostMapping("/stream")
    public ResponseEntity<ProcessingJobDTO> startStreamDetection(@RequestParam Long sessionId, @RequestParam String streamUrl) {
        ProcessingJobDTO job = videoProcessingService.startLiveStream(sessionId, streamUrl);
        return ResponseEntity.ok(job);
    }
    
    @PostMapping("/video")
    public ResponseEntity<ProcessingJobDTO> uploadVideo(@RequestParam Long sessionId, @RequestParam MultipartFile file) throws IOException {
        ProcessingJobDTO job = videoProcessingService.uploadVideo(sessionId, file);
        return ResponseEntity.ok(job);
    }
    
    @GetMapping("/status/{jobId}")
    public ResponseEntity<ProcessingJobDTO> getJobStatus(@PathVariable String jobId) {
        return ResponseEntity.ok(videoProcessingService.getJobStatus(jobId));
    }
    
    @PostMapping("/process")
    public ResponseEntity<DetectionEventDTO> processDetection(@RequestBody RealTimeDetectionDTO detectionDTO) {
        if (detectionDTO.getDetections() != null && !detectionDTO.getDetections().isEmpty()) {
            for (RealTimeDetectionDTO.DetectionResult detection : detectionDTO.getDetections()) {
                detectionService.processDetection(detectionDTO.getSessionId(), detection);
            }
        }
        
        if (detectionDTO.getHeadCount() != null) {
            detectionService.updateHeadCount(detectionDTO.getSessionId(), detectionDTO.getHeadCount().getDetected());
        }
        
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/events/{sessionId}")
    public ResponseEntity<List<DetectionEventDTO>> getSessionDetections(@PathVariable Long sessionId) {
        return ResponseEntity.ok(detectionService.getSessionDetections(sessionId));
    }
    
    @GetMapping("/scores/{sessionId}")
    public ResponseEntity<List<StudentScoreDTO>> getSessionScores(@PathVariable Long sessionId) {
        return ResponseEntity.ok(detectionService.getSessionStudentScores(sessionId));
    }
    
    @GetMapping("/stats/{sessionId}")
    public ResponseEntity<RealTimeDetectionDTO.SessionStats> getSessionStats(@PathVariable Long sessionId) {
        return ResponseEntity.ok(detectionService.calculateSessionStats(sessionId));
    }
}
