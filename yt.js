const ytdlp = require('yt-dlp-exec');

// Fungsi untuk mengekstrak video ID dari URL
function extractVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function youtube_downloader(url) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const metadata = await ytdlp(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      skipDownload: true,  // Tidak mengunduh video
      format: 'best[ext=mp4]',
    });

    return {
      status: 'success',
      downloadUrl: metadata.url,  // Link unduhan langsung
      title: metadata.title,      // Judul video
    };
  } catch (error) {
    throw new Error(`Failed to retrieve download link: ${error.message}`);
  }
}

module.exports = { youtube_downloader };
