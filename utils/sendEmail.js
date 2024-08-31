import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationLink) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "Gmail", // Example using Gmail; replace with your service
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Email Verification",
			html: `<p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
		};

		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("Error sending email:", error.message);
		throw new Error("Email could not be sent");
	}
};

//export {sendVerificationEmail};
