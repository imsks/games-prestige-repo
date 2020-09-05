import React from "react";
import { Line } from "rc-progress";

const ProgressComponent = ({ percentage, size }) => {
  return(
    <>
    <p className="size">
      <b>Progress</b>: {percentage}% of 100% | <b>File size</b>: {size} bytes
    </p>
    <Line percent={percentage} strokeWidth="1" strokeColor="red" />
  </>
  )
};

export default ProgressComponent;
