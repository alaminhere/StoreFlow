import { Resend } from 'resend';
import ApiError from '../apiError.js';
import config from '../../config/config.js';

interface Params {
  to: string;
  invoiceNo: string;
  partyName: string;
  storeName: string;
  pdfBuffer: Buffer;
}

const resend = new Resend(config.email.apiKey);
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    c =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c]!,
  );
const sendInvoiceEmail = async ({
  to,
  invoiceNo,
  partyName,
  storeName,
  pdfBuffer,
}: Params) => {
  const safeFileName = `${invoiceNo.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;

  const safeInvoiceNo = escapeHtml(invoiceNo);
  const safeParty = escapeHtml(partyName);
  const safeStore = escapeHtml(storeName);

  const { error } = await resend.emails.send({
    from: `StoreFlow <noreply@${config.email.from}>`,
    to,
    subject: `Invoice ${invoiceNo} from ${storeName}`,
    text: `Hi ${partyName}, please find your invoice ${invoiceNo} from ${storeName} attached.`,
    html: `
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        :root { color-scheme: light dark; supported-color-schemes: light dark; }
        @media (prefers-color-scheme: dark) {
          .sf-bg { background: #0b111b !important; }
          .sf-card { background: #121a27 !important; border-color: #273243 !important; }
          .sf-logo-text, .sf-title, .sf-strong { color: #f4f6f8 !important; }
          .sf-logo-mark { background: #d6a24a !important; color: #17120a !important; }
          .sf-muted { color: #98a2b3 !important; }
          .sf-box { background: #1a2332 !important; border-color: #273243 !important; }
          .sf-badge { background: #2a2417 !important; color: #f5c451 !important; border-color: #d6a24a !important; }
          .sf-notice { background: #2a2417 !important; color: #f5c451 !important; }
          .sf-footer { color: #667085 !important; }
        }
      </style>

      <div class="sf-bg" style="background: #f7f8fa; padding: 40px 16px; font-family: Arial, sans-serif;">
        <div class="sf-card" style="
          max-width: 480px;
          margin: auto;
          background: #ffffff;
          border: 1px solid #e3e7ed;
          border-radius: 14px;
          padding: 36px 28px;
          text-align: center;
        ">
          <div class="sf-logo-text" style="font-size: 24px; font-weight: 700; color: #172033;">
           ${safeStore}
          </div>

          <p class="sf-title" style="margin: 4px 0 4px; font-size: 18px; font-weight: 700; color: #172033;">
            Your invoice is ready
          </p>

          <p class="sf-muted" style="margin: 0; font-size: 14px; line-height: 1.6; color: #667085;">
            Hi ${safeParty}, here is your invoice from ${safeStore}.
          </p>

          <div style="margin: 20px 0 4px;">
            <span class="sf-badge" style="
              display: inline-block;
              background: #f5efe3;
              border: 1px solid #c08a32;
              color: #a97425;
              border-radius: 999px;
              padding: 6px 16px;
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.5px;
            ">${safeInvoiceNo}</span>
          </div>

          <div class="sf-box" style="
            margin: 24px 0;
            background: #faf7f2;
            border: 1px solid #e3e7ed;
            border-radius: 10px;
            padding: 16px 18px;
            text-align: left;
          ">
            <table role="presentation" width="100%" style="font-size: 13px; border-collapse: collapse;">
              <tr>
                <td class="sf-muted" style="color: #667085; padding: 4px 0;">Invoice No</td>
                <td class="sf-strong" style="color: #172033; font-weight: 700; text-align: right; padding: 4px 0;">${safeInvoiceNo}</td>
              </tr>
              <tr>
                <td class="sf-muted" style="color: #667085; padding: 4px 0;">From</td>
                <td class="sf-strong" style="color: #172033; font-weight: 700; text-align: right; padding: 4px 0;">${safeStore}</td>
              </tr>
              <tr>
                <td class="sf-muted" style="color: #667085; padding: 4px 0;">Attachment</td>
                <td class="sf-strong" style="color: #172033; font-weight: 700; text-align: right; padding: 4px 0;">PDF</td>
              </tr>
            </table>
          </div>

          <div class="sf-notice" style="
            background: #fff4d6;
            color: #a97425;
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 13px;
          ">
            The full invoice is attached to this email as a PDF.
          </div>

          <p class="sf-footer" style="margin: 20px 0 0; font-size: 12px; line-height: 1.6; color: #98a2b3;">
            Thank you for your business. If you have any questions about this invoice, please contact ${safeStore}.
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: safeFileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  if (error) {
    const status = (error as { statusCode?: number })?.statusCode;
    if (status === 422) {
      throw new ApiError(
        400,
        'Invalid recipient email. Please use a real email address.',
      );
    }

    if (status === 403) {
      throw new ApiError(
        400,
        'Email domain is not verified. Please contact support.',
      );
    }

    if (status === 429) {
      throw new ApiError(429, 'Too many emails sent. Please try again later.');
    }

    throw new ApiError(
      500,
      'Could not send invoice email. Please try again later.',
    );
  }
};

export default sendInvoiceEmail;
