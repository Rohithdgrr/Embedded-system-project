package com.examshield.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionReportDTO {
    
    private Long sessionId;
    private String sessionName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private Integer expectedCount;
    private Integer actualCount;
    private Integer missingCount;
    
    private SummaryStats summaryStats;
    private List<StudentScoreDTO> topStudents;
    private List<DetectionEventDTO> recentDetections;
    private List<AlertHistoryDTO> recentAlerts;
    private Map<String, Integer> violationBreakdown;
    private List<TimeSeriesPoint> timeline;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SummaryStats {
        private Long totalDetections;
        private Long criticalAlerts;
        private Double averageScore;
        private Double maxScore;
        private Integer suspiciousStudents;
        private Integer normalStudents;
        private Integer phoneCount;
        private Integer earphoneCount;
        private Integer watchCount;
        private Integer chitCount;
        private Integer textbookCount;
        private Integer notebookCount;
        private Integer behaviorCount;
        private String alertLevel;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimeSeriesPoint {
        private LocalDateTime timestamp;
        private Integer detectionCount;
        private Integer headCount;
        private Double avgScore;
    }
}
