const { Telegraf } = require("telegraf");
const { tiktok_downloader } = require("./tiktok.js");
const { youtube_downloader } = require("./yt.js");
const fs = require("fs");
const path = require("path"); // Untuk jalur aman

//
const bot = new Telegraf("7948851790:AAHV7WQq_gX-U812Qk1tpfanoQt_BrSaEcI");

// Jalankan bot Telegram
bot.launch();

// Informasi debugging
console.log("Bot Telegram untuk TikTok downloader sedang berjalan...");
// Tanggapan untuk perintah /start
const usersFilePath = path.join(__dirname, "users.json");

bot.start((ctx) => {
  const userId = ctx.from.id;
  const userName =
    ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ""}`;

  // Membaca file users.json (jika ada)
  let users = [];
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    users = data ? JSON.parse(data) : [];
    //ctx.reply(`Halo ${userName}! Kirimkan tautan video TikTok untuk mengunduh.`);
  }

  // Cek jika pengguna belum terdaftar
  if (!users.find((user) => user.id === userId)) {
    users.push({ id: userId, name: userName });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    //ctx.reply(`Halo ${userName}! Kirimkan tautan video TikTok untuk mengunduh.`);
  }

  ctx.reply(`Halo ${userName}! Kirimkan tautan video TikTok untuk mengunduh.`);
});

// bot.start((ctx) => {
//   ctx.reply('Halo! Kirimkan tautan video TikTok untuk mengunduh.');
// });

// Menangani pesan yang berisi tautan TikTok
// Menangani pesan yang berisi tautan TikTok atau YouTube
bot.on("text", async (ctx) => {
  const url = ctx.message.text;
  //tiktok
  if (url.includes("tiktok.com")) {
    ctx.reply("Sedang memproses tautan TikTok Anda...");
    try {
      const result = await tiktok_downloader(url);
      if (result.videoUrl) {
        await ctx.replyWithVideo(
          { url: result.videoUrl },
          { caption: "Berikut video TikTok yang Anda minta." }
        );
        //iklan
        ctx.reply("more project\nhttps://tik-me.netlify.app/");
      } else {
        ctx.reply("Maaf, tidak dapat menemukan video dari tautan tersebut.");
        ctx.reply("more project\nhttps://tik-me.netlify.app/");
      }
    } catch (error) {
      console.error("Gagal mengunduh video TikTok:", error);
      ctx.reply("Terjadi kesalahan saat mengunduh video TikTok.");
    }
  }
  //youtube
  else if (url.includes("youtube.com") || url.includes("youtu.be")) {
    ctx.reply("Sedang memproses tautan YouTube Anda...");
    try {
      const result = await youtube_downloader(url);
      if (result.downloadUrl) {
        const shortText = " DOWNLOAD"; // Teks yang ingin ditampilkan
        ctx.reply(
          `Berikut tautan unduh untuk video YouTube: [${shortText}](${result.downloadUrl})`,
          {
            parse_mode: "MarkdownV2",
          }
        );
        // ctx.reply(`Berikut tautan unduh untuk video YouTube: ${result.downloadUrl}`);
        //iklan
        ctx.reply("more project\nhttps://tik-me.netlify.app/");
        console.log(result.downloadUrl);
      } else {
        ctx.reply("Maaf, tidak dapat menemukan video dari tautan tersebut.");
      }
    } catch (error) {
      console.error("Gagal mengunduh video YouTube:", error);
      ctx.reply(
        "Terjadi kesalahan saat mengunduh video YouTube secara langsung."
      );
    }
  } else {
    ctx.reply("Harap kirimkan tautan TikTok atau YouTube yang valid.");
  }
});

// Menangani penghentian dengan aman
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
//tele end
