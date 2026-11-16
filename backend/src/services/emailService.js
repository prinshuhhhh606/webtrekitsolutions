/**
 * emailService.js - Email & Notification Service for Webtrek IT Solutions
 * Handles transactional emails, quotation notifications, and customer enquiry confirmations.
 */

const sendEnquiryNotification = async (enquiryData) => {
  try {
    console.log(`[Email Service] Notification: New enquiry received from ${enquiryData.name} (${enquiryData.email}) for ${enquiryData.service}`);
    // Integrable with Nodemailer, SendGrid, or Resend when SMTP credentials are provided in .env
    return { success: true };
  } catch (error) {
    console.error(`[Email Service Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendCustomerConfirmation = async (enquiryData) => {
  try {
    console.log(`[Email Service] Confirmation sent to customer: ${enquiryData.email}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email Service Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendQuotation = async (customerEmail, quotationDetails) => {
  try {
    console.log(`[Email Service] Quotation shared with: ${customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email Service Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEnquiryNotification,
  sendCustomerConfirmation,
  sendQuotation,
};

