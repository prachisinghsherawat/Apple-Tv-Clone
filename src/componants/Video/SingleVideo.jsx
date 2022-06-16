import React from "react";

export default function SingleVideo() {
  return (
    <div>
      <video loop autoPlay>
        <video
          controls
          autoPlay
          src="https://s3.amazonaws.com/codecademy-content/courses/React/react_video-cute.mp4"
        />
        {/* <source
          src="https://s3.amazonaws.com/codecademy-content/courses/React/react_video-cute.mp4"
          type="video/mp4"
        /> */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
