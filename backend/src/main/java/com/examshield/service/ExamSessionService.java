package com.examshield.service;

import com.examshield.dto.*;
import com.examshield.model.*;
import com.examshield.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExamSessionService {
    
    private final ExamSessionRepository examSessionRepository;
    private final DetectionEventRepository detectionEventRepository;
    private final StudentScoreRepository studentScoreRepository;
    private final AlertHistoryRepository alertHistoryRepository;
    private final ProcessingJobRepository processingJobRepository;
    
    @Transactional
    public ExamSessionDTO createSession(CreateSessionRequest request) {
        ExamSession session = ExamSession.builder()
                .name(request.getName())
                .expectedCount(request.getExpectedCount())
                .streamUrl(request.getStreamUrl())
                .status(ExamSession.SessionStatus.PENDING)
                .actualCount(0)
                .totalViolations(0)
                .totalScore(0.0)
                .build();
        
        session = examSessionRepository.save(session);
        log.info("Created new exam session: {}", session.getId());
        return ExamSessionDTO.fromEntity(session);
    }
    
    public List<ExamSessionDTO> getAllSessions() {
        return examSessionRepository.findByOrderByCreatedAtDesc()
                .stream()
                .map(ExamSessionDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public ExamSessionDTO getSessionById(Long id) {
        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
        return ExamSessionDTO.fromEntity(session);
    }
    
    @Transactional
    public ExamSessionDTO startSession(Long id, String streamUrl) {
        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
        
        session.setStatus(ExamSession.SessionStatus.ACTIVE);
        session.setStartTime(LocalDateTime.now());
        if (streamUrl != null) {
            session.setStreamUrl(streamUrl);
        }
        
        session = examSessionRepository.save(session);
        log.info("Started exam session: {}", id);
        return ExamSessionDTO.fromEntity(session);
    }
    
    @Transactional
    public ExamSessionDTO pauseSession(Long id) {
        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
        
        session.setStatus(ExamSession.SessionStatus.PAUSED);
        session = examSessionRepository.save(session);
        log.info("Paused exam session: {}", id);
        return ExamSessionDTO.fromEntity(session);
    }
    
    @Transactional
    public ExamSessionDTO resumeSession(Long id) {
        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
        
        session.setStatus(ExamSession.SessionStatus.ACTIVE);
        session = examSessionRepository.save(session);
        log.info("Resumed exam session: {}", id);
        return ExamSessionDTO.fromEntity(session);
    }
    
    @Transactional
    public ExamSessionDTO endSession(Long id) {
        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
        
        session.setStatus(ExamSession.SessionStatus.COMPLETED);
        session.setEndTime(LocalDateTime.now());
        
        List<StudentScore> scores = studentScoreRepository.findBySessionId(id);
        if (!scores.isEmpty()) {
            double totalScore = scores.stream()
                    .mapToDouble(StudentScore::getTotalScore)
                    .sum();
            session.setTotalScore(totalScore / scores.size());
            session.setTotalViolations(scores.stream()
                    .mapToInt(StudentScore::getViolationCount)
                    .sum());
        }
        
        session = examSessionRepository.save(session);
        log.info("Ended exam session: {}", id);
        return ExamSessionDTO.fromEntity(session);
    }
    
    @Transactional
    public ExamSessionDTO updateHeadCount(Long id, Integer actualCount) {
        ExamSession session = examSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found: " + id));
        
        session.setActualCount(actualCount);
        session = examSessionRepository.save(session);
        return ExamSessionDTO.fromEntity(session);
    }
    
    public void deleteSession(Long id) {
        examSessionRepository.deleteById(id);
        log.info("Deleted exam session: {}", id);
    }
    
    public List<ExamSessionDTO> getActiveSessions() {
        return examSessionRepository.findByStatus(ExamSession.SessionStatus.ACTIVE)
                .stream()
                .map(ExamSessionDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
