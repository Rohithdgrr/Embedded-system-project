package com.examshield.service;

import com.examshield.dto.ProcessingJobDTO;
import com.examshield.model.*;
import com.examshield.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoProcessingService {
    
    private final ExamSessionRepository examSessionRepository;
    private final ProcessingJobRepository processingJobRepository;
    
    @Value("${app.upload.directory:./uploads}")
    private String uploadDirectory;
    
    @Transactional
    public ProcessingJobDTO uploadVideo(Long sessionId, MultipartFile file) throws IOException {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        String jobId = UUID.randomUUID().toString();
        
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileName = jobId + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        ProcessingJob job = ProcessingJob.builder()
                .jobId(jobId)
                .session(session)
                .jobType(ProcessingJob.JobType.VIDEO_UPLOAD)
                .status(ProcessingJob.JobStatus.PENDING)
                .fileName(file.getOriginalFilename())
                .filePath(filePath.toString())
                .totalFrames(0L)
                .processedFrames(0L)
                .progressPercentage(0)
                .detectionCount(0)
                .startedAt(LocalDateTime.now())
                .build();
        
        job = processingJobRepository.save(job);
        log.info("Created video processing job: {}", jobId);
        
        return ProcessingJobDTO.fromEntity(job);
    }
    
    @Transactional
    public ProcessingJobDTO updateJobProgress(String jobId, Long processedFrames, Integer progressPercentage, Integer detectionCount) {
        ProcessingJob job = processingJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        
        job.setProcessedFrames(processedFrames);
        job.setProgressPercentage(progressPercentage);
        job.setDetectionCount(detectionCount);
        
        if (job.getStatus() == ProcessingJob.JobStatus.PENDING) {
            job.setStatus(ProcessingJob.JobStatus.PROCESSING);
        }
        
        job = processingJobRepository.save(job);
        return ProcessingJobDTO.fromEntity(job);
    }
    
    @Transactional
    public ProcessingJobDTO completeJob(String jobId, Long totalFrames, Integer detectionCount) {
        ProcessingJob job = processingJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        
        job.setStatus(ProcessingJob.JobStatus.COMPLETED);
        job.setTotalFrames(totalFrames);
        job.setProcessedFrames(totalFrames);
        job.setProgressPercentage(100);
        job.setDetectionCount(detectionCount);
        job.setCompletedAt(LocalDateTime.now());
        
        job = processingJobRepository.save(job);
        log.info("Completed video processing job: {}", jobId);
        
        return ProcessingJobDTO.fromEntity(job);
    }
    
    @Transactional
    public ProcessingJobDTO failJob(String jobId, String errorMessage) {
        ProcessingJob job = processingJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        
        job.setStatus(ProcessingJob.JobStatus.FAILED);
        job.setErrorMessage(errorMessage);
        job.setCompletedAt(LocalDateTime.now());
        
        job = processingJobRepository.save(job);
        log.error("Failed video processing job: {}, error: {}", jobId, errorMessage);
        
        return ProcessingJobDTO.fromEntity(job);
    }
    
    public ProcessingJobDTO getJobStatus(String jobId) {
        ProcessingJob job = processingJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        return ProcessingJobDTO.fromEntity(job);
    }
    
    public ProcessingJobDTO startLiveStream(Long sessionId, String streamUrl) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        String jobId = UUID.randomUUID().toString();
        
        ProcessingJob job = ProcessingJob.builder()
                .jobId(jobId)
                .session(session)
                .jobType(ProcessingJob.JobType.LIVE_STREAM)
                .status(ProcessingJob.JobStatus.PROCESSING)
                .fileName("Live Stream")
                .streamUrl(streamUrl)
                .progressPercentage(0)
                .detectionCount(0)
                .startedAt(LocalDateTime.now())
                .build();
        
        job = processingJobRepository.save(job);
        log.info("Started live stream job: {} for session {}", jobId, sessionId);
        
        return ProcessingJobDTO.fromEntity(job);
    }
}
