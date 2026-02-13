package com.examshield.dto;

import com.examshield.model.StudentScore;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentScoreDTO {
    
    private Long id;
    private Long sessionId;
    private String trackingId;
    private Double totalScore;
    private Integer violationCount;
    private StudentScore.AlertLevel alertLevel;
    private Integer phoneCount;
    private Integer earphoneCount;
    private Integer watchCount;
    private Integer chitCount;
    private Integer textbookCount;
    private Integer notebookCount;
    private Integer behaviorCount;
    private LocalDateTime firstSeen;
    private LocalDateTime lastSeen;
    
    public static StudentScoreDTO fromEntity(StudentScore score) {
        return StudentScoreDTO.builder()
                .id(score.getId())
                .sessionId(score.getSession().getId())
                .trackingId(score.getTrackingId())
                .totalScore(score.getTotalScore())
                .violationCount(score.getViolationCount())
                .alertLevel(score.getAlertLevel())
                .phoneCount(score.getPhoneCount())
                .earphoneCount(score.getEarphoneCount())
                .watchCount(score.getWatchCount())
                .chitCount(score.getChitCount())
                .textbookCount(score.getTextbookCount())
                .notebookCount(score.getNotebookCount())
                .behaviorCount(score.getBehaviorCount())
                .firstSeen(score.getFirstSeen())
                .lastSeen(score.getLastSeen())
                .build();
    }
}
