import React, { useEffect, useState } from "react";
import axios from "axios";
import RenderYoutube from "../components/Youtube";
import ProgressComponent from "../components/ReactProgress";
import Header from "../components/Header";
import { youtubeLink, socket, baseURL } from "../config";
import { nullifyLocalStorageData, setLocalStorageData } from "../utils";

const YoutubeDownloader = () => {
  const [link, setLink] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [disabled, setdisabled] = useState(false);
  const [quality, setQuality] = useState({
    qualityLabel: "360p",
    quality: "medium",
    container: "mp4",
    itag: 18,
  });
  const [size, setSize] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [requesting, setRequesting] = useState(false);
  const [formats, setFormats] = useState([]);

  const setInitialDataIfProgress = () => {
    const url = localStorage.getItem("url");
    const ql = localStorage.getItem("ql");

    if (!link && url && ql) {
      setLink(url);
      setQuality(ql);
    }
  };

  useEffect(() => {
    nullifyLocalStorageData();
    setPercentage(0);
    setData(null);
    if (link && youtubeLink.test(link)) {
      setFormats(["loading"]);
      axios
        .post("http://localhost:5050/available-formats", { link })
        .then((response) => {
          setFormats(response.data.availableFormats);
        });
    } else {
      setFormats([]);
    }
  }, [link]);

  socket.on("downloadStatus", (data) => {
    setPercentage(parseInt((data.downloaded / data.total) * 100));
    setSize(parseInt(data.total));
    if (requesting) {
      setRequesting(false);
    }

    if (!size) {
      setSize(data.total);
      setInitialDataIfProgress();
    }

    if (data.percentage > percentage) {
      setPercentage(data.percentage);
    }
    if (data.downloaded === data.total) {
      socket.disconnect();
    }
  });

  const handleSubmitInput = (e) => {
    e.preventDefault();
    setError(null);
    if (youtubeLink.test(link)) {
      const payload = { link, quality };
      setLocalStorageData({ url: link, ql: quality });
      setRequesting(true);
      setdisabled(true);
      axios
        .post(baseURL, payload)
        .then(({ data }) => {
          nullifyLocalStorageData();
          setdisabled(false);
          if (data.error) {
            console.log("data error", data.error);
            setError(data.error);
            setRequesting(false);
            return;
          }
          setData(data.message);
          setError(null);
        })
        .catch((err) => {
          setError("network error connection", err);
          nullifyLocalStorageData();
          setdisabled(false);
          setRequesting(null);
        });
    } else {
      setError("Enter Valid Youtube Url");
      setdisabled(false);
      setRequesting(false);
      nullifyLocalStorageData();
    }
  };

  const basicReset = () => {
    setdisabled(false);
    setPercentage(0);
    setData(null);
    setError(null);
    setSize(0);
    setRequesting(false);
  };

  const inputHandle = (e) => {
    setLink(e.target.value);
    basicReset();
  };

  const handleSelectOption = (e) => {
    setQuality(
      JSON.parse(
        document.getElementById("selectedQuality").selectedOptions[0].value
      )
    );
  };

  const downloadVideo = (e) => {
    e.preventDefault();
    if (youtubeLink.test(link)) {
      const payload = { link, quality };
      setLocalStorageData({ url: link, ql: quality });
      setRequesting(true);
      setdisabled(true);
      axios
        .post(baseURL, payload)
        .then(({ data }) => {
          nullifyLocalStorageData();
          setdisabled(false);
          setData(data.message);
          setError(null);
        })
        .catch((err) => {
          setError("network error connection", err);
          nullifyLocalStorageData();
          setdisabled(false);
          setRequesting(null);
        });
    } else {
      setError("Enter Valid Youtube Url");
      setdisabled(false);
      setRequesting(false);
      nullifyLocalStorageData();
    }
  };

  return (
    <>
      <Header />
      <div className="row">
        <div className="col s12 m6">
          <form onSubmit={handleSubmitInput}>
            <div className="videolinkholder">
              <h4 className="url">URL</h4>
              <input
                value={link}
                disabled={disabled}
                id="email"
                onChange={inputHandle}
                placeholder="Enter Your URL"
              />

              <label className="formatLabel">Video Quality</label>
              <select
                onChange={handleSelectOption}
                id="selectedQuality"
                className="input-field"
              >
                <option key="" value="">
                  Auto
                </option>
                {formats && formats.length > 0 ? (
                  <>
                    {formats.map((el, key) => {
                      return (
                        <option value={JSON.stringify(el)} key={key}>
                          {el.qualityLabel}
                        </option>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <option disabled={true}>Loading</option>
                  </>
                )}
              </select>
            </div>
            <span>
              {error ? (
                <span className="error" data-error={error} data-success="right">
                  {error}
                </span>
              ) : null}
              {data ? <div className="success">{data}</div> : null}
              {!percentage && requesting ? (
                <div className="helper-text">Requesting for download...</div>
              ) : null}
              {percentage ? (
                <ProgressComponent percentage={percentage} size={size} />
              ) : null}
            </span>
            <div className="downloadContainer">
              <button
                className="btn downloadBtn"
                disabled={disabled}
                type="submit"
                onClick={downloadVideo}
              >
                Download
              </button>
            </div>
          </form>
        </div>
        <div className="col s12 m6">
          {" "}
          {youtubeLink.test(link) ? (
            <RenderYoutube videoId={link.split("v=")[1]} />
          ) : (
            <div className="centerItem">
              {" "}
              <div className="no-video-display">No preview available</div>
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
};

export default YoutubeDownloader;
