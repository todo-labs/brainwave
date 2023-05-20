/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
export function html(params: { url: string }) {
  const { url } = params;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Verification Code</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 24px;
          color: #333;
          margin: 0 0 20px;
        }
        p {
          font-size: 16px;
          color: #555;
          line-height: 1.5;
          margin: 0 0 10px;
        }
        .verification-code {
          font-size: 36px;
          color: #ff5a5f;
          text-align: center;
          margin: 20px 0;
        }
        .disclaimer {
          font-size: 14px;
          color: #888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Login Verification Code</h1>
        <p>Dear User,</p>
        <p>Thank you for choosing our platform. To securely log in, please use the following verification code:</p>
        <a href="${url}" >
          <h2 class="verification-code">
            Click here to login
          </h2>
        </a>
        <p class="disclaimer">This code is valid for a limited time and should not be shared with anyone. If you did not request this code, please ignore this email.</p>
        <p>Happy exploring!<br>Brainwave.quest</p>
      </div>
    </body>
    </html>
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
export function text({ url }: { url: string }) {
  return `Sign in to Brainwave.quest\n${url}\n\n`;
}
