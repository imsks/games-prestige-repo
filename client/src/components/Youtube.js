import React from "react";
import YouTube from "react-youtube";

const opts = {
  width: "100%",
  playerVars: {
    autoplay: 0,
  },
};

function RenderYoutube({ videoId }) {
  function _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  return (
    <div className="youtubeVideo">
      <YouTube videoId={videoId} opts={opts} onReady={_onReady} />
    </div>
  );
}

export default RenderYoutube;
