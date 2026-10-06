import { Resend } from 'resend';
import config from '../../config/config.js';
import ApiError from '../apiError.js';

const resend = new Resend(config.email.apiKey);

const sendVerificationEmail = async (code: string, email: string) => {
  const digits = code
    .split('')
    .map(
      d => `
        <td style="padding: 0 3px;">
          <div class="sf-digit" style="
            width: 40px;
            height: 50px;
            line-height: 50px;
            border-radius: 8px;
            background: #f5efe3;
            border: 1px solid #c08a32;
            color: #a97425;
            font-size: 24px;
            font-weight: 700;
            text-align: center;
          ">${d}</div>
        </td>`,
    )
    .join('');

  const { error } = await resend.emails.send({
    from: 'StoreFlow <noreply@alaminhere.com>',
    to: email,
    subject: 'Verify Your Account',
    text: `Your verification code is: ${code}`,
    html: `
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        :root { color-scheme: light dark; supported-color-schemes: light dark; }
        @media (prefers-color-scheme: dark) {
          .sf-bg { background: #0b111b !important; }
          .sf-card { background: #121a27 !important; border-color: #273243 !important; }
          .sf-logo-text, .sf-title { color: #f4f6f8 !important; }
          .sf-logo-mark { background: #d6a24a !important; color: #17120a !important; }
          .sf-muted { color: #98a2b3 !important; }
          .sf-digit {
            background: #28251d !important;
            border-color: #d6a24a !important;
            color: #e2b461 !important;
          }
          .sf-notice { background: #2a2417 !important; color: #f5c451 !important; }
          .sf-footer { color: #667085 !important; }
        }
      </style>

      <div class="sf-bg" style="
        background: #f7f8fa;
        padding: 40px 16px;
        font-family: Arial, sans-serif;
      ">
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
            <span class="sf-logo-mark" style="
              display: inline-block;
              width: 30px;
              height: 30px;
              line-height: 30px;
              border-radius: 8px;
              background: #c08a32;
              color: #ffffff;
              font-size: 16px;
              vertical-align: middle;
              margin-right: 8px;
            ">S</span>StoreFlow
          </div>

          <p class="sf-title" style="
            margin: 24px 0 4px;
            font-size: 18px;
            font-weight: 700;
            color: #172033;
          ">
            Verify your account
          </p>

          <p class="sf-muted" style="
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: #667085;
          ">
            Use the code below to finish signing up.
          </p>

          <table role="presentation" align="center" style="margin: 24px auto;">
            <tr>${digits}</tr>
          </table>

          <div class="sf-notice" style="
            background: #fff4d6;
            color: #a97425;
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 13px;
          ">
            This code will expire soon
          </div>

          <p class="sf-footer" style="
            margin: 20px 0 0;
            font-size: 12px;
            line-height: 1.6;
            color: #98a2b3;
          ">
            Didn’t request this? You can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    const isInvalidEmail =
      error.name === 'validation_error' ||
      error.message?.toLowerCase().includes('invalid `to`');

    if (isInvalidEmail) {
      throw new ApiError(
        400,
        'Invalid email address. Please use a valid email.',
      );
    }
    throw new ApiError(500, 'Could not send email. Please try again later.');
  }
};

export default sendVerificationEmail;
