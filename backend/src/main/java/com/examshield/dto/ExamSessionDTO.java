package com.examshield.dto;

import com.examshield.model.ExamSession;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamSessionDTO {
    
    private Long id;
    private String name;
    private Integer expectedCount;
    private Integer actualCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ExamSession.SessionStatus status;
    private String streamUrl;
    private Integer totalViolations;
    private Double totalScore;
    private LocalDateTime createdAt;
    
    public static ExamSessionDTO fromEntity(ExamSession session) {
        return ExamSessionDTO.builder()
                .id(session.getId())
                .name(session.getName())
                .expectedCount(session.getExpectedCount())
                .actualCount(session.getActualCount())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .status(session.getStatus())
                .streamUrl(session.getStreamUrl())
                .totalViolations(session.getTotalViolations())
                .totalScore(session.getTotalScore())
                .createdAt(session.getCreatedAt())
                .build();
    }
}
