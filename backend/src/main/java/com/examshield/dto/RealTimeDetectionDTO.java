package com.examshield.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RealTimeDetectionDTO {
    
    private Long sessionId;
    private String jobId;
    private LocalDateTime timestamp;
    private Integer frameNumber;
    private List<DetectionResult> detections;
    private HeadCountInfo headCount;
    private Map<String, StudentScoreDTO> studentScores;
    private SessionStats sessionStats;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetectionResult {
        private String personId;
        private String className;
        private Double confidence;
        private Integer x;
        private Integer y;
        private Integer width;
        private Integer height;
        private Integer points;
        private String description;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HeadCountInfo {
        private Integer detected;
        private Integer expected;
        private Integer missing;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SessionStats {
        private Integer totalDetections;
        private Integer phoneCount;
        private Integer earphoneCount;
        private Integer watchCount;
        private Integer chitCount;
        private Integer textbookCount;
        private Integer notebookCount;
        private Integer behaviorCount;
        private Double averageScore;
        private Double maxScore;
        private Integer suspiciousStudents;
        private Integer normalStudents;
        private String alertLevel;
    }
}
