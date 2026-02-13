package com.examshield.service;

import com.examshield.dto.*;
import com.examshield.model.*;
import com.examshield.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DetectionService {
    
    private final ExamSessionRepository examSessionRepository;
    private final DetectionEventRepository detectionEventRepository;
    private final StudentScoreRepository studentScoreRepository;
    private final AlertHistoryRepository alertHistoryRepository;
    private final ProcessingJobRepository processingJobRepository;
    
    @Value("${app.detection.cooldown-seconds:30}")
    private int cooldownSeconds;
    
    @Value("${app.detection.decay-points-per-minute:2}")
    private int decayPointsPerMinute;
    
    private final Map<String, Map<DetectionEvent.EventType, LocalDateTime>> lastDetectionTime = new ConcurrentHashMap<>();
    
    private static final Map<DetectionEvent.EventType, Integer> POINTS_MAP;
    
    static {
        Map<DetectionEvent.EventType, Integer> temp = new HashMap<>();
        temp.put(DetectionEvent.EventType.PHONE_DETECTED, 25);
        temp.put(DetectionEvent.EventType.EARPHONE_DETECTED, 30);
        temp.put(DetectionEvent.EventType.SMARTWATCH_DETECTED, 20);
        temp.put(DetectionEvent.EventType.CHIT_DETECTED, 20);
        temp.put(DetectionEvent.EventType.TEXTBOOK_DETECTED, 35);
        temp.put(DetectionEvent.EventType.NOTEBOOK_DETECTED, 30);
        temp.put(DetectionEvent.EventType.ELECTRONIC_DEVICE_DETECTED, 25);
        temp.put(DetectionEvent.EventType.HEAD_TURNED, 10);
        temp.put(DetectionEvent.EventType.LOOKING_AT_NEIGHBOR, 8);
        temp.put(DetectionEvent.EventType.LEANING_TOWARD_OTHER, 10);
        temp.put(DetectionEvent.EventType.PASSING_GESTURE, 15);
        temp.put(DetectionEvent.EventType.HEAD_COUNT_MISMATCH, 40);
        temp.put(DetectionEvent.EventType.EXTRA_PERSON, 50);
        temp.put(DetectionEvent.EventType.INTERACTION_DETECTED, 15);
        POINTS_MAP = Collections.unmodifiableMap(temp);
    }
    
    @Transactional
    public DetectionEventDTO processDetection(Long sessionId, RealTimeDetectionDTO.DetectionResult detection) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        String cooldownKey = sessionId + "-" + detection.getPersonId();
        Map<DetectionEvent.EventType, LocalDateTime> personDetections = lastDetectionTime.computeIfAbsent(cooldownKey, k -> new ConcurrentHashMap<>());
        
        DetectionEvent.EventType eventType = getEventType(detection.getClassName());
        LocalDateTime lastTime = personDetections.get(eventType);
        
        if (lastTime != null && lastTime.plusSeconds(cooldownSeconds).isAfter(LocalDateTime.now())) {
            log.debug("Detection cooldown active for {} in session {}", eventType, sessionId);
            return null;
        }
        
        personDetections.put(eventType, LocalDateTime.now());
        
        int points = calculatePoints(eventType, detection.getConfidence());
        
        DetectionEvent event = DetectionEvent.builder()
                .session(session)
                .timestamp(LocalDateTime.now())
                .personId(detection.getPersonId())
                .eventType(eventType)
                .description(detection.getDescription())
                .confidence(detection.getConfidence())
                .points(points)
                .boundingBoxX(detection.getX())
                .boundingBoxY(detection.getY())
                .boundingBoxWidth(detection.getWidth())
                .boundingBoxHeight(detection.getHeight())
                .isResolved(false)
                .build();
        
        event = detectionEventRepository.save(event);
        
        updateStudentScore(session, detection.getPersonId(), eventType, points);
        createAlertIfNeeded(session, eventType, points, detection.getPersonId());
        
        log.info("Processed detection: {} for person {} in session {}", eventType, detection.getPersonId(), sessionId);
        
        return DetectionEventDTO.fromEntity(event);
    }
    
    @Transactional
    public void updateHeadCount(Long sessionId, int detectedCount) {
        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        
        session.setActualCount(detectedCount);
        examSessionRepository.save(session);
        
        if (session.getExpectedCount() != null && detectedCount != session.getExpectedCount()) {
            int diff = Math.abs(detectedCount - session.getExpectedCount());
            if (detectedCount > session.getExpectedCount()) {
                for (int i = 0; i < diff; i++) {
                    createDetectionEvent(session, "extra_" + i, DetectionEvent.EventType.EXTRA_PERSON, 50);
                }
            } else {
                createDetectionEvent(session, "missing", DetectionEvent.EventType.HEAD_COUNT_MISMATCH, 40);
            }
        }
    }
    
    private void createDetectionEvent(ExamSession session, String personId, DetectionEvent.EventType eventType, int points) {
        DetectionEvent event = DetectionEvent.builder()
                .session(session)
                .timestamp(LocalDateTime.now())
                .personId(personId)
                .eventType(eventType)
                .description(eventType.name())
                .confidence(1.0)
                .points(points)
                .isResolved(false)
                .build();
        
        detectionEventRepository.save(event);
    }
    
    private void updateStudentScore(ExamSession session, String trackingId, DetectionEvent.EventType eventType, int points) {
        StudentScore score = studentScoreRepository
                .findBySessionIdAndTrackingId(session.getId(), trackingId)
                .orElseGet(() -> {
                    StudentScore newScore = StudentScore.builder()
                            .session(session)
                            .trackingId(trackingId)
                            .build();
                    return studentScoreRepository.save(newScore);
                });
        
        double confidenceMultiplier = score.getTotalScore() != null ? 0.85 : 1.0;
        double adjustedPoints = points * confidenceMultiplier;
        
        score.setTotalScore((score.getTotalScore() != null ? score.getTotalScore() : 0) + adjustedPoints);
        score.setViolationCount((score.getViolationCount() != null ? score.getViolationCount() : 0) + 1);
        score.setLastSeen(LocalDateTime.now());
        
        incrementViolationCount(score, eventType);
        updateAlertLevel(score);
        
        studentScoreRepository.save(score);
    }
    
    private void incrementViolationCount(StudentScore score, DetectionEvent.EventType eventType) {
        switch (eventType) {
            case PHONE_DETECTED:
                score.setPhoneCount((score.getPhoneCount() != null ? score.getPhoneCount() : 0) + 1);
                break;
            case EARPHONE_DETECTED:
                score.setEarphoneCount((score.getEarphoneCount() != null ? score.getEarphoneCount() : 0) + 1);
                break;
            case SMARTWATCH_DETECTED:
                score.setWatchCount((score.getWatchCount() != null ? score.getWatchCount() : 0) + 1);
                break;
            case CHIT_DETECTED:
                score.setChitCount((score.getChitCount() != null ? score.getChitCount() : 0) + 1);
                break;
            case TEXTBOOK_DETECTED:
                score.setTextbookCount((score.getTextbookCount() != null ? score.getTextbookCount() : 0) + 1);
                break;
            case NOTEBOOK_DETECTED:
                score.setNotebookCount((score.getNotebookCount() != null ? score.getNotebookCount() : 0) + 1);
                break;
            default:
                score.setBehaviorCount((score.getBehaviorCount() != null ? score.getBehaviorCount() : 0) + 1);
                break;
        }
    }
    
    private void updateAlertLevel(StudentScore score) {
        double totalScore = score.getTotalScore();
        
        if (totalScore >= 86) {
            score.setAlertLevel(StudentScore.AlertLevel.CRITICAL);
        } else if (totalScore >= 61) {
            score.setAlertLevel(StudentScore.AlertLevel.SUSPICIOUS);
        } else if (totalScore >= 16) {
            score.setAlertLevel(StudentScore.AlertLevel.WATCH);
        } else {
            score.setAlertLevel(StudentScore.AlertLevel.NORMAL);
        }
    }
    
    private void createAlertIfNeeded(ExamSession session, DetectionEvent.EventType eventType, int points, String personId) {
        AlertHistory.AlertLevel alertLevel = getAlertLevel(points);
        
        if (alertLevel != AlertHistory.AlertLevel.GREEN) {
            AlertHistory alert = AlertHistory.builder()
                    .session(session)
                    .alertLevel(alertLevel)
                    .message(String.format("%s detected for person %s (%d points)", eventType.name(), personId, points))
                    .personId(personId)
                    .eventType(eventType.name())
                    .isAcknowledged(false)
                    .timestamp(LocalDateTime.now())
                    .build();
            
            alertHistoryRepository.save(alert);
        }
    }
    
    private AlertHistory.AlertLevel getAlertLevel(int points) {
        if (points >= 86) return AlertHistory.AlertLevel.CRITICAL;
        if (points >= 61) return AlertHistory.AlertLevel.RED;
        if (points >= 36) return AlertHistory.AlertLevel.ORANGE;
        if (points >= 16) return AlertHistory.AlertLevel.YELLOW;
        return AlertHistory.AlertLevel.GREEN;
    }
    
    private int calculatePoints(DetectionEvent.EventType eventType, Double confidence) {
        int basePoints = POINTS_MAP.getOrDefault(eventType, 10);
        return (int) (basePoints * (confidence != null ? confidence : 1.0));
    }
    
    private DetectionEvent.EventType getEventType(String className) {
        return switch (className.toLowerCase()) {
            case "phone", "mobile" -> DetectionEvent.EventType.PHONE_DETECTED;
            case "earphone", "earbuds", "headphones" -> DetectionEvent.EventType.EARPHONE_DETECTED;
            case "smartwatch", "watch" -> DetectionEvent.EventType.SMARTWATCH_DETECTED;
            case "chit", "paper_slip", "chit_slip" -> DetectionEvent.EventType.CHIT_DETECTED;
            case "textbook", "book" -> DetectionEvent.EventType.TEXTBOOK_DETECTED;
            case "notebook", "notes" -> DetectionEvent.EventType.NOTEBOOK_DETECTED;
            case "electronic_device", "tablet" -> DetectionEvent.EventType.ELECTRONIC_DEVICE_DETECTED;
            default -> DetectionEvent.EventType.INTERACTION_DETECTED;
        };
    }
    
    public List<DetectionEventDTO> getSessionDetections(Long sessionId) {
        return detectionEventRepository.findBySessionIdOrderByTimestampDesc(sessionId)
                .stream()
                .map(DetectionEventDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<StudentScoreDTO> getSessionStudentScores(Long sessionId) {
        return studentScoreRepository.findBySessionIdOrderByTotalScoreDesc(sessionId)
                .stream()
                .map(StudentScoreDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public RealTimeDetectionDTO.SessionStats calculateSessionStats(Long sessionId) {
        List<DetectionEvent> events = detectionEventRepository.findBySessionId(sessionId);
        List<StudentScore> scores = studentScoreRepository.findBySessionId(sessionId);
        
        int phoneCount = 0, earphoneCount = 0, watchCount = 0, chitCount = 0;
        int textbookCount = 0, notebookCount = 0, behaviorCount = 0;
        
        for (DetectionEvent event : events) {
            switch (event.getEventType()) {
                case PHONE_DETECTED -> phoneCount++;
                case EARPHONE_DETECTED -> earphoneCount++;
                case SMARTWATCH_DETECTED -> watchCount++;
                case CHIT_DETECTED -> chitCount++;
                case TEXTBOOK_DETECTED -> textbookCount++;
                case NOTEBOOK_DETECTED -> notebookCount++;
                default -> behaviorCount++;
            }
        }
        
        double avgScore = scores.stream()
                .mapToDouble(s -> s.getTotalScore() != null ? s.getTotalScore() : 0)
                .average()
                .orElse(0);
        
        long suspiciousCount = scores.stream()
                .filter(s -> s.getAlertLevel() == StudentScore.AlertLevel.SUSPICIOUS ||
                           s.getAlertLevel() == StudentScore.AlertLevel.CRITICAL)
                .count();
        
        String alertLevel = "GREEN";
        if (avgScore >= 86) alertLevel = "CRITICAL";
        else if (avgScore >= 61) alertLevel = "RED";
        else if (avgScore >= 36) alertLevel = "ORANGE";
        else if (avgScore >= 16) alertLevel = "YELLOW";
        
        return RealTimeDetectionDTO.SessionStats.builder()
                .totalDetections(events.size())
                .phoneCount(phoneCount)
                .earphoneCount(earphoneCount)
                .watchCount(watchCount)
                .chitCount(chitCount)
                .textbookCount(textbookCount)
                .notebookCount(notebookCount)
                .behaviorCount(behaviorCount)
                .averageScore(avgScore)
                .suspiciousStudents((int) suspiciousCount)
                .normalStudents((int) (scores.size() - suspiciousCount))
                .alertLevel(alertLevel)
                .build();
    }
}
