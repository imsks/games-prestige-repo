import React from "react";

const Select = ({ selectChange, quality, disabled, formats, link }) => {
  let object = {};
  const getFormats = (formats) => {
    return (
      formats
        // .sort((a, b) => a.quality - b.quality)
        .map((ele, index) => {
          // console.log(ele)
          return (
            <option key={index} value={ele}>
              {ele.qualityLabel || ""}
            </option>
          );
        })
    );
  };

  return (
    <>
      <div className="formatQuality">
        <label className="formatLabel">Video Quality</label>
        <select
          disabled={disabled}
          onChange={selectChange}
          value={quality}
          className="input-field"
        >
          <option key="" value="">
            Auto
          </option>
          {formats && formats.length > 0 && formats[0] != "loading" ? (
            getFormats(formats)
          ) : (
            <option key="loading" value="loading" disabled={true}>
              {`${link ? "Loading....." : ""}`}
            </option>
          )}
        </select>
      </div>
    </>
  );
};

export default Select;
