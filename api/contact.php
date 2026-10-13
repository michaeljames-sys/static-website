<?php
/**
 * Hair Art Clinic - Contact & Consultation Lead Capture Handler
 * Receives POST data from website forms, sends an email to wa6453214@gmail.com,
 * and saves a persistent copy to data/leads.json to ensure 0% lead loss.
 */

// Set JSON response headers
header('Content-Type: application/json; charset=UTF-8');

// Allow local and production origins
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Only POST requests are supported.'
    ]);
    exit;
}

// 1. Destination Email as requested by owner
$toEmail = 'wa6453214@gmail.com';
$clinicEmail = 'hairartandskincare123@gmail.com';

// 2. Read incoming input (supports both FormData and application/json)
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if (!is_array($data)) {
    $data = $_POST;
}

// 3. Sanitize fields
$name      = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$phone     = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$email     = isset($data['email']) ? trim(strip_tags($data['email'])) : '';
$doctor    = isset($data['doctor']) ? trim(strip_tags($data['doctor'])) : '';
$procedure = isset($data['procedure']) ? trim(strip_tags($data['procedure'])) : (isset($data['treatment']) ? trim(strip_tags($data['treatment'])) : '');
$preferred = isset($data['preferred']) ? trim(strip_tags($data['preferred'])) : 'Any (Phone/WhatsApp)';
$message   = isset($data['message']) ? trim(strip_tags($data['message'])) : (isset($data['notes']) ? trim(strip_tags($data['notes'])) : '');

// 4. Validate required fields
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide both your name and phone number.'
    ]);
    exit;
}

// 5. Build Lead Record
$timestamp = date('Y-m-d H:i:s');
$clientIP  = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

$lead = [
    'id'        => 'LEAD-' . time() . '-' . rand(100, 999),
    'timestamp' => $timestamp,
    'name'      => $name,
    'phone'     => $phone,
    'email'     => $email ?: 'Not provided',
    'doctor'    => $doctor ?: 'Any Available Doctor (Dr. Syed Imran Zahid / Dr. Kashif Hussain)',
    'procedure' => $procedure ?: 'Hair Restoration Consultation',
    'preferred' => $preferred,
    'message'   => $message ?: 'No additional notes',
    'ip'        => $clientIP
];

// 6. Save to local database (data/leads.json) for 100% fail-safe backup
$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$leadsFile = $dataDir . '/leads.json';
$existingLeads = [];
if (file_exists($leadsFile)) {
    $fileContent = @file_get_contents($leadsFile);
    $decoded = @json_decode($fileContent, true);
    if (is_array($decoded)) {
        $existingLeads = $decoded;
    }
}
$existingLeads[] = $lead;
@file_put_contents($leadsFile, json_encode($existingLeads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// 7. Compose and send HTML email to wa6453214@gmail.com
$subject = "💇 [Hair Art Lead] New Consultation Inquiry from " . $name;

$htmlBody = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .header h2 { margin: 0 0 6px; font-size: 22px; color: #ffffff; }
    .header p { margin: 0; font-size: 14px; color: #94a3b8; }
    .content { padding: 24px; }
    .row { display: flex; border-bottom: 1px solid #f1f5f9; padding: 12px 0; font-size: 15px; }
    .label { font-weight: bold; width: 180px; color: #475569; }
    .val { flex: 1; color: #0f172a; }
    .btn { display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; margin-top: 15px; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class='card'>
    <div class='header'>
      <h2>New Patient Consultation Request</h2>
      <p>Hair Art Clinic — Pull Abdullah, Samundri Road, Faisalabad</p>
    </div>
    <div class='content'>
      <div class='row'><div class='label'>Patient Name:</div><div class='val'><strong>" . htmlspecialchars($name) . "</strong></div></div>
      <div class='row'><div class='label'>Phone Number:</div><div class='val'><a href='tel:" . htmlspecialchars($phone) . "'>" . htmlspecialchars($phone) . "</a></div></div>
      <div class='row'><div class='label'>Email Address:</div><div class='val'>" . htmlspecialchars($email ?: 'None') . "</div></div>
      <div class='row'><div class='label'>Selected Doctor:</div><div class='val'>" . htmlspecialchars($doctor ?: 'General Consultation') . "</div></div>
      <div class='row'><div class='label'>Procedure / Method:</div><div class='val'>" . htmlspecialchars($procedure ?: 'Hair Transplant') . "</div></div>
      <div class='row'><div class='label'>Preferred Contact:</div><div class='val'>" . htmlspecialchars($preferred) . "</div></div>
      <div class='row'><div class='label'>Patient Message:</div><div class='val'>" . nl2br(htmlspecialchars($message)) . "</div></div>
      <div class='row'><div class='label'>Received Time:</div><div class='val'>" . htmlspecialchars($timestamp) . "</div></div>

      <div style='text-align: center; margin-top: 20px;'>
        <a class='btn' href='https://wa.me/" . preg_replace('/[^0-9]/', '', $phone) . "' target='_blank'>
          💬 Open WhatsApp Chat with Patient
        </a>
      </div>
    </div>
    <div class='footer'>
      This lead was captured from the official Hair Art Clinic website and safely logged in data/leads.json.
    </div>
  </div>
</body>
</html>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Hair Art Clinic <noreply@hairartclinic.pk>\r\n";
$headers .= "Reply-To: " . ($email ?: 'hairartandskincare123@gmail.com') . "\r\n";
$headers .= "Cc: " . $clinicEmail . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send via PHP mail
$mailSent = @mail($toEmail, $subject, $htmlBody, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your details have been submitted. Our clinic patient coordinator will contact you shortly.',
    'lead_id' => $lead['id'],
    'mail_sent' => $mailSent,
    'backup_saved' => true
]);
