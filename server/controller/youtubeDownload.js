const fs = require("fs");
const youtubedl = require("youtube-dl");
const path = require("path");
const progress = require("progress-stream");
const desktopPath = `${process.env["HOME"]}/Desktop/`;
const videoFolder = path.join(desktopPath, `/videos`);
const youtubeBaseUrl = "https://www.youtube.com/watch?v";
const ytdl = require("ytdl-core");
const { info } = require("console");

exports.getAvailableFormats = async (req, res) => {
  const url = req.body.link;
  const quality = req.body.quality;
  const id = url.split("v=")[1];
  let info = await ytdl.getInfo(id);

  let formatHash = {};

  info.formats.forEach((element) => {
    if (
      element &&
      element.hasVideo &&
      element.quality &&
      element.container == "mp4"
    ) {
      formatHash[element.quality] = {
        qualityLabel: element.qualityLabel,
        quality: element.qualityLabel,
        container: element.container,
        itag: element.itag,
      };
    }
  });

  let availableFormats = Object.values(formatHash);

  return res.json({ availableFormats });
};

exports.downloads = async (req, res) => {
  let io = require("../socket").getIO();

  const url = req.body.link;
  const quality = req.body.quality;
  const id = url.split("v=")[1];

  if (!fs.existsSync(videoFolder)) {
    // console.log(`creating video folder to ${desktopPath}`);
    fs.mkdirSync(videoFolder);
  }

  const output = path.join(
    desktopPath,
    `${id}-${quality.qualityLabel || "auto"}.mp4`
  );

  var stream = ytdl(url, {quality: quality.itag});

  let title;

  /* Spit-out information when recieved */
  stream.on("info", (info) => {
    // console.log(info.videoDetails.title);
    title = info.videoDetails.title;
    // console.log(info.videoDetails);
  });

  stream.on("progress", (_, downloaded, total) => {
    console.log("The Total Size is " + total);
    // console.log(
    //   (parseInt(downloaded / 1024) / parseInt(total / 1024)) * 100 + "%"
    // );
    const payload = {
      title,
      downloaded: downloaded,
      total: total,
    }
    io.emit("downloadStatus", payload);
    return downloaded;
  });

  stream.on("end", () => {
    return res.json({
      status: "Success",
      message: "Video Downloaded"
    })
  });

  stream.pipe(fs.createWriteStream(output));
};
