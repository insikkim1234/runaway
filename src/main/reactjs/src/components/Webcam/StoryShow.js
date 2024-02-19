import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { useSwipeable } from "react-swipeable";

// test 하드코딩
const videoUrl1 =
  "https://kr.object.ncloudstorage.com/runaway/runaway_story/3_202402181632_c2e4ecda-f";
const videoUrl2 =
  "https://kr.object.ncloudstorage.com/runaway/runaway_story/3_202402181632_c2e4ecda-f";
const videoUrl3 =
  "https://kr.object.ncloudstorage.com/runaway/runaway_story/3_202402181748_c100dca0-5";
const videoUrls = [videoUrl1, videoUrl2, videoUrl3];

const StoryShow = () => {
  const [videoIndex, setVideoIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setVideoIndex((prevIndex) =>
        prevIndex === videoUrls.length - 1 ? 0 : prevIndex + 1
      );
    },
    onSwipedRight: () => {
      setVideoIndex((prevIndex) =>
        prevIndex === 0 ? videoUrls.length - 1 : prevIndex - 1
      );
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div {...handlers}>
      <VideoPlayer src={videoUrls[videoIndex]} />
    </div>
  );
};

export default StoryShow;