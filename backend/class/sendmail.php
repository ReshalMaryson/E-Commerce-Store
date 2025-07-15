<?php
// Include PHPMailer files
require "../PHPMailer/src/Exception.php";
require "../PHPMailer/src/PHPMailer.php";
require "../PHPMailer/src/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


function sendmail($receiver_email, $receiver_fname, $receiver_lname, $body)
{
    $receviername = $receiver_fname;
    $mail = new PHPMailer(true);
    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'SENDER_EMAIL';
        $mail->Password = 'gycm mcaa fqip lukd';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Email Details
        $mail->setFrom('SENDER_EMAIL', 'SENDER_NAME);
        $mail->addAddress( $receiver_email,$receviername);
        $mail->Subject = 'Order Confirmation';
        $mail->Body = $body;

        // Send Email
        if ($mail->send()) {
            return true;
        }
    } catch (Exception $e) {
        return $mail->ErrorInfo;
    }
}
