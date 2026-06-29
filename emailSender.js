const { Resend } = require('resend');

async function sendEmail(pdfBuffer, formData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const submissionDate = formData.declarationDate || new Date().toISOString().split('T')[0];
    const vendorName = formData.vendorName || 'Unknown';
    const vendorType = formData.vendorType || 'N/A';

    const safeFilename = vendorName.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
    const fileDate = submissionDate.replace(/-/g, '');

    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: linear-gradient(135deg, #1a6b4a, #2a8f66); padding: 28px 32px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.3px;">
            New Vendor Registration Received
          </h1>
          <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">
            Energize Pharmaceuticals (P) Limited — Vendor Portal
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid #e0e0e0; border-top: none; padding: 28px 32px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #333;">
            A new vendor registration has been submitted. Key details are summarised below. The complete registration form is attached as a PDF.
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <thead>
              <tr>
                <th colspan="2" style="text-align: left; padding: 10px 14px; background: #1a6b4a; color: #fff; border-radius: 4px 4px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Registration Summary
                </th>
              </tr>
            </thead>
            <tbody>
              ${emailRow('Vendor Name', vendorName)}
              ${emailRow('Vendor Type', vendorType)}
              ${emailRow('Vendor Composition', formData.vendorComposition || '—')}
              ${emailRow('City & State', formData.cityAndState || '—')}
              ${emailRow('Mobile No', formData.mobileNo || '—')}
              ${emailRow('Email ID', formData.emailId || '—')}
              ${emailRow('GSTIN', formData.gstin || '—')}
              ${emailRow('PAN No', formData.pan || '—')}
              ${emailRow('Bank Name', formData.bankName || '—')}
              ${emailRow('IFSC Code', formData.ifscCode || '—')}
              ${emailRow('Credit Period', formData.creditPeriodDays ? formData.creditPeriodDays + ' days' : '—')}
              ${emailRow('Date of Submission', submissionDate, true)}
            </tbody>
          </table>

          <p style="margin: 0; padding: 14px 16px; background: #f0faf5; border-left: 4px solid #1a6b4a; border-radius: 4px; font-size: 13px; color: #1a6b4a; line-height: 1.5;">
            📎 Complete registration form attached as PDF.
          </p>
        </div>

        <p style="text-align: center; font-size: 11px; color: #999; margin-top: 20px;">
          This is an automated email from the Energize Vendor Registration Portal.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Energize Vendor Portal <onboarding@resend.dev>',
      to: [process.env.HR_EMAIL],
      subject: `New Vendor Registration — ${vendorName} | ${vendorType}`,
      html: htmlBody,
      attachments: [
        {
          filename: `Vendor_Registration_${safeFilename}_${fileDate}.pdf`,
          content: pdfBuffer.toString('base64')
        }
      ]
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log('✅ Email sent successfully, id:', data?.id);
    return { success: true };
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    throw err;
  }
}

function emailRow(label, value, isLast = false) {
  const borderBottom = isLast ? '' : 'border-bottom: 1px solid #eee;';
  return `
    <tr>
      <td style="padding: 10px 14px; font-weight: 600; color: #555; width: 40%; ${borderBottom} background: #fafafa;">${label}</td>
      <td style="padding: 10px 14px; color: #1a1a1a; ${borderBottom}">${value}</td>
    </tr>
  `;
}

module.exports = sendEmail;
