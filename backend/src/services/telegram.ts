import https from "https";

function env(name: string, def?: string) {
  const v = process.env[name];
  return v && v.trim() ? v : def;
}

export async function sendTelegramMessage(text: string): Promise<void> {
  const token = env("TELEGRAM_BOT_TOKEN");
  const chatId = env("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;

  const body = new URLSearchParams({ chat_id: chatId, text });

  await new Promise<void>((resolve, reject) => {
    const req = https.request(
      {
        host: "api.telegram.org",
        path: `/bot${token}/sendMessage`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body.toString()).toString()
        },
        timeout: 5000
      },
      (res) => {
        // Drain response to free socket
        res.on("data", () => {});
        res.on("end", () => resolve());
      }
    );
    req.on("error", (err) => {
      // Don't throw; notifications must not break main flow
      resolve();
    });
    req.on("timeout", () => {
      req.destroy();
      resolve();
    });
    req.write(body.toString());
    req.end();
  });
}

export function getShiftConfig() {
  const start = env("SHIFT_START", "09:00")!;
  const end = env("SHIFT_END", "18:00")!;
  const grace = Number(env("SHIFT_GRACE_MINUTES", "15"));
  return { start, end, grace: isFinite(grace) ? grace : 15 };
}
