// Notification service - supports both Brevo (SMTP/API) and browser notifications
import { ProctorAlert } from '../types';

export interface NotificationData {
  to: string[];
  subject: string;
  message: string;
  htmlContent?: string;
  violationType?: string;
  seat?: string;
  timestamp?: string;
}

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Browser notification request
export const requestBrowserNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Browser notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Send browser notification
export const sendBrowserNotification = (title: string, body: string, icon?: string): void => {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      tag: 'violation-alert'
    });
  }
};

// Send violation browser notification
export const sendViolationBrowserNotification = (
  violationType: string,
  seat: string,
  confidence: number
): void => {
  sendBrowserNotification(
    `🚨 Violation Detected: ${violationType}`,
    `Seat ${seat} - ${(confidence * 100).toFixed(0)}% confidence`,
    '/favicon.ico'
  );
};

// Email notification via backend API (calls Spring Boot backend)
export const sendEmailNotification = async (data: NotificationData): Promise<{ success: boolean; error?: string }> => {
  try {
    const validEmails = data.to.filter(isValidEmail);
    if (validEmails.length === 0) {
      return { success: false, error: 'No valid email addresses provided' };
    }

    // Call backend API to send email
    const response = await fetch('http://localhost:8080/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: validEmails,
        subject: data.subject,
        message: data.message,
        violationType: data.violationType,
        seat: data.seat,
        timestamp: data.timestamp
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || `Server error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Email notification error:', error);
    return { success: false, error: 'Failed to connect to server. Make sure backend is running.' };
  }
};

// Brevo API configuration - using environment variables
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_SENDER_NAME = 'ExamShield AI';
const BREVO_SENDER_EMAIL = import.meta.env.VITE_BREVO_SENDER_EMAIL || 'rreon633@gmail.com';

// ── Core send function (supports custom htmlContent) ──────────────────────

export const sendNotification = async (data: NotificationData): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  try {
    const validEmails = data.to.filter(isValidEmail);
    if (validEmails.length === 0) {
      return { success: false, error: 'No valid email addresses provided' };
    }

    // If no valid API key configured, try browser notification as fallback
    if (!BREVO_API_KEY || BREVO_API_KEY.length < 20) {
      const browserPermitted = await requestBrowserNotificationPermission();
      if (browserPermitted) {
        sendBrowserNotification(data.subject, data.message);
        return { success: true, messageId: 'browser-notification' };
      }
      return { success: false, error: 'No email service configured. Enable browser notifications or configure Brevo API key.' };
    }

    // Use custom htmlContent if provided, otherwise build a simple one
    const htmlContent = data.htmlContent || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #6C5CE7; margin-top: 0;">🚨 ExamShield Alert</h2>
          
          <div style="background: #FFE5E5; border-left: 4px solid #FF6B6B; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; font-size: 16px; color: #2D3436;"><strong>${data.subject}</strong></p>
          </div>
          
          <p style="color: #636E72; line-height: 1.6;">${data.message}</p>
          
          ${data.violationType ? `
          <div style="margin-top: 20px; padding: 15px; background: #F8F9FA; border-radius: 8px;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Violation Type:</strong> ${data.violationType}</p>
            ${data.seat ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Seat:</strong> ${data.seat}</p>` : ''}
            ${data.timestamp ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Time:</strong> ${data.timestamp}</p>` : ''}
          </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #E8E2DC; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #636E72; text-align: center;">
            This is an automated alert from ExamShield Proctoring System.<br>
            Please take immediate action if required.
          </p>
        </div>
      </div>
    `;

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL
        },
        to: validEmails.map(email => ({ email })),
        subject: data.subject,
        htmlContent: htmlContent,
        textContent: data.message
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;

      if (response.status === 401) {
        return { success: false, error: 'Invalid Brevo API key. Check your configuration.' };
      }
      if (response.status === 400 && errorMessage.includes('sender')) {
        return { success: false, error: 'Sender email not verified. Verify your domain in Brevo.' };
      }

      return { success: false, error: errorMessage };
    }

    const result = await response.json().catch(() => ({ messageId: 'unknown' }));
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Send single violation alert (legacy)
export const sendViolationAlert = async (
  invigilatorEmails: string[],
  violationType: string,
  seat: string,
  confidence: number
): Promise<{ success: boolean; error?: string }> => {
  const timestamp = new Date().toLocaleString();

  // Send browser notification
  sendViolationBrowserNotification(violationType, seat, confidence);

  // Also try email
  return sendNotification({
    to: invigilatorEmails.filter(isValidEmail),
    subject: `🚨 Violation Detected - ${violationType}`,
    message: `A ${violationType} has been detected at seat ${seat} with ${(confidence * 100).toFixed(0)}% confidence. Immediate attention may be required.`,
    violationType,
    seat,
    timestamp
  });
};


// ── COMPREHENSIVE VIOLATION REPORT EMAIL ──────────────────────────────────
// Sends ONE email with ALL violations listed in a table with evidence context

const TYPE_EMOJI: Record<string, string> = {
  PHONE: '📱',
  CHIT: '📝',
  TEXTBOOK: '📖',
  NOTEBOOK: '📓',
  DEVICE: '💻',
  HEAD_TURN: '🔄',
  LEANING: '⬇️',
  MULTIPLE_PEOPLE: '👥',
  NO_PERSON: '⚠️',
};

const TYPE_FRIENDLY: Record<string, string> = {
  PHONE: 'Mobile Phone',
  CHIT: 'Chit / Paper Note',
  TEXTBOOK: 'Textbook',
  NOTEBOOK: 'Notebook',
  DEVICE: 'Electronic Device',
  HEAD_TURN: 'Head Turn',
  LEANING: 'Looking Down',
  MULTIPLE_PEOPLE: 'Multiple People',
  NO_PERSON: 'No Person Detected',
};

const LEVEL_COLOR: Record<string, string> = {
  CRITICAL: '#EA2027',
  HIGH: '#FF6B6B',
  MEDIUM: '#FFA502',
  LOW: '#6C5CE7',
  STABLE: '#00B894',
};

export const sendComprehensiveViolationReport = async (
  emails: string[],
  alerts: ProctorAlert[],
  totalPoints: number
): Promise<{ success: boolean; error?: string }> => {
  const validEmails = emails.filter(isValidEmail);
  if (validEmails.length === 0) {
    return { success: false, error: 'No valid email addresses provided' };
  }

  if (alerts.length === 0) {
    return { success: false, error: 'No violations to report' };
  }

  // Build violation summary counts
  const typeCounts: Record<string, number> = {};
  const seatCounts: Record<string, number> = {};
  alerts.forEach(a => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    seatCounts[a.seat] = (seatCounts[a.seat] || 0) + 1;
  });

  const sortedAlerts = [...alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const uniqueSeats = Object.keys(seatCounts).length;
  const highSeverity = alerts.filter(a => a.level === 'HIGH' || a.level === 'CRITICAL').length;
  const now = new Date().toLocaleString();

  // Build the summary badges
  const summaryBadges = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => `
      <span style="display:inline-block; background:#F5F0EB; border-radius:6px; padding:4px 10px; margin:2px 4px; font-size:12px; font-weight:600;">
        ${TYPE_EMOJI[type] || '•'} ${TYPE_FRIENDLY[type] || type}: <strong>${count}</strong>
      </span>
    `).join('');

  // Build the violation rows
  const violationRows = sortedAlerts.map((alert, i) => {
    const bgColor = i % 2 === 0 ? '#FFFFFF' : '#FAFAFA';
    const levelColor = LEVEL_COLOR[alert.level] || '#636E72';
    const emoji = TYPE_EMOJI[alert.type] || '•';
    const friendlyType = TYPE_FRIENDLY[alert.type] || alert.type;
    const confidence = (alert.confidence * 100).toFixed(0);
    const time = alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return `
      <tr style="background:${bgColor};">
        <td style="padding:10px 12px; border-bottom:1px solid #E8E2DC; font-size:13px;">
          ${emoji} <strong>${friendlyType}</strong>
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #E8E2DC; font-size:13px; text-align:center;">
          <strong>${alert.seat}</strong>
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #E8E2DC; font-size:13px; text-align:center;">
          <span style="background:${levelColor}15; color:${levelColor}; padding:2px 8px; border-radius:4px; font-weight:700; font-size:11px;">
            ${alert.level}
          </span>
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #E8E2DC; font-size:13px; text-align:center;">
          ${confidence}%
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #E8E2DC; font-size:13px; text-align:center; font-weight:600; color:#FF6B6B;">
          +${alert.score}
        </td>
        <td style="padding:10px 12px; border-bottom:1px solid #E8E2DC; font-size:12px; color:#636E72;">
          ${time}
        </td>
      </tr>
      <tr style="background:${bgColor};">
        <td colspan="6" style="padding:4px 12px 10px 12px; border-bottom:1px solid #E8E2DC; font-size:11px; color:#636E72;">
          ${alert.description}
        </td>
      </tr>
    `;
  }).join('');

  // Build the full HTML email
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #F5F0EB; padding: 24px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #6C5CE7, #a29bfe); border-radius: 16px; padding: 28px 32px; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 22px;">🚨 Exam Violation Report</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px;">ExamShield AI Proctoring System • ${now}</p>
      </div>

      <!-- Summary Stats -->
      <div style="background: white; border-radius: 12px; padding: 20px 24px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="text-align:center; padding:8px;">
              <div style="font-size:28px; font-weight:700; color:#FF6B6B;">${alerts.length}</div>
              <div style="font-size:10px; font-weight:700; color:#636E72; text-transform:uppercase; letter-spacing:1px;">Total Violations</div>
            </td>
            <td style="text-align:center; padding:8px;">
              <div style="font-size:28px; font-weight:700; color:#6C5CE7;">${totalPoints}</div>
              <div style="font-size:10px; font-weight:700; color:#636E72; text-transform:uppercase; letter-spacing:1px;">Severity Points</div>
            </td>
            <td style="text-align:center; padding:8px;">
              <div style="font-size:28px; font-weight:700; color:#2D3436;">${uniqueSeats}</div>
              <div style="font-size:10px; font-weight:700; color:#636E72; text-transform:uppercase; letter-spacing:1px;">Seats Flagged</div>
            </td>
            <td style="text-align:center; padding:8px;">
              <div style="font-size:28px; font-weight:700; color:#EA2027;">${highSeverity}</div>
              <div style="font-size:10px; font-weight:700; color:#636E72; text-transform:uppercase; letter-spacing:1px;">High Severity</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Violation Type Summary -->
      <div style="background: white; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <h3 style="margin: 0 0 10px; font-size: 13px; color: #636E72; text-transform: uppercase; letter-spacing: 1px;">Detected Violations</h3>
        <div>${summaryBadges}</div>
      </div>

      <!-- All Violations Table -->
      <div style="background: white; border-radius: 12px; overflow: hidden; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <div style="padding: 16px 20px; border-bottom: 2px solid #E8E2DC;">
          <h3 style="margin: 0; font-size: 14px; color: #2D3436;">Complete Violation Log</h3>
          <p style="margin: 4px 0 0; font-size: 11px; color: #636E72;">${alerts.length} violations detected across ${uniqueSeats} seat(s)</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #F5F0EB;">
              <th style="padding: 10px 12px; text-align: left; font-size: 10px; color: #636E72; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Violation</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 10px; color: #636E72; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Seat</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 10px; color: #636E72; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Level</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 10px; color: #636E72; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Conf.</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 10px; color: #636E72; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Points</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 10px; color: #636E72; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Time</th>
            </tr>
          </thead>
          <tbody>
            ${violationRows}
          </tbody>
        </table>
      </div>

      <!-- Seats Breakdown -->
      <div style="background: white; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
        <h3 style="margin: 0 0 10px; font-size: 13px; color: #636E72; text-transform: uppercase; letter-spacing: 1px;">Violations by Seat</h3>
        ${Object.entries(seatCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([seat, count]) => {
        const seatAlerts = alerts.filter(a => a.seat === seat);
        const seatPoints = seatAlerts.reduce((s, a) => s + (a.score || 0), 0);
        const seatTypes = [...new Set(seatAlerts.map(a => TYPE_FRIENDLY[a.type] || a.type))].join(', ');
        return `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #F5F0EB;">
                <div>
                  <strong style="font-size:14px; color:#2D3436;">Seat ${seat}</strong>
                  <span style="font-size:11px; color:#636E72; margin-left:8px;">${seatTypes}</span>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:12px; font-weight:700; color:#FF6B6B;">${seatPoints} pts</span>
                  <span style="font-size:11px; color:#636E72; margin-left:6px;">(${count} violations)</span>
                </div>
              </div>
            `;
      }).join('')
    }
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 16px;">
        <p style="font-size: 11px; color: #636E72; margin: 0;">
          This report was generated automatically by <strong>ExamShield AI</strong>.<br>
          Immediate review is recommended for flagged seats.
        </p>
      </div>
    </div>
  `;

  const plainText = `EXAM VIOLATION REPORT
Generated: ${now}
Total Violations: ${alerts.length}
Total Severity Points: ${totalPoints}
Seats Flagged: ${uniqueSeats}

VIOLATIONS:
${sortedAlerts.map(a =>
    `• [${a.level}] ${TYPE_FRIENDLY[a.type] || a.type} at Seat ${a.seat} — ${(a.confidence * 100).toFixed(0)}% confidence, +${a.score} pts — ${a.description}`
  ).join('\n')}

Please review immediately.
— ExamShield AI Proctoring System`;

  // Send browser notification
  sendBrowserNotification(
    `🚨 ${alerts.length} Violations Detected — ${totalPoints} pts`,
    `${uniqueSeats} seat(s) flagged. Check your email for the full report.`
  );

  return sendNotification({
    to: validEmails,
    subject: `🚨 Exam Violation Report — ${alerts.length} violations, ${totalPoints} points`,
    message: plainText,
    htmlContent: htmlContent
  });
};
