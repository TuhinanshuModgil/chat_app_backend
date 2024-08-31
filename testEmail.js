import {sendVerificationEmail} from './utils/sendEmail.js';

(async () => {
    try {
        await sendVerificationEmail("prishachopra6@gmail.com", "http://localhost:8000/verify-email/test");
        console.log("Test email sent successfully!");
    } catch (error) {
        console.error("Failed to send test email:", error.message);
    }
})();
