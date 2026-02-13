package com.examshield.dto;

import com.examshield.model.ProcessingJob;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessingJobDTO {
    
    private Long id;
    private String jobId;
    private Long sessionId;
    private ProcessingJob.JobType jobType;
    private ProcessingJob.JobStatus status;
    private String fileName;
    private Long totalFrames;
    private Long processedFrames;
    private Integer progressPercentage;
    private Integer detectionCount;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    
    public static ProcessingJobDTO fromEntity(ProcessingJob job) {
        return ProcessingJobDTO.builder()
                .id(job.getId())
                .jobId(job.getJobId())
                .sessionId(job.getSession() != null ? job.getSession().getId() : null)
                .jobType(job.getJobType())
                .status(job.getStatus())
                .fileName(job.getFileName())
                .totalFrames(job.getTotalFrames())
                .processedFrames(job.getProcessedFrames())
                .progressPercentage(job.getProgressPercentage())
                .detectionCount(job.getDetectionCount())
                .errorMessage(job.getErrorMessage())
                .startedAt(job.getStartedAt())
                .completedAt(job.getCompletedAt())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
