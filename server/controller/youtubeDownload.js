const fs = require("fs");
const path = require("path");
const desktopPath = `${process.env["HOME"]}/Desktop/`;
const videoFolder = path.join(desktopPath, `/videos`);
const ytdl = require("ytdl-core");

exports.getAvailableFormats = async (req, res) => {
  const url = req.body.link;
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
    title = info.videoDetails.title;
  });

  stream.on("progress", (_, downloaded, total) => {
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
