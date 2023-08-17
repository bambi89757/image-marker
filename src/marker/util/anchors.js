import { findAnchorsByCorners } from ".";

/** local start */
export default (flatMarks, stageSize, imageSize) => {
  return flatMarks.map(m => {
    let {
      _x: x,
      _y: y,
      _width: width,
      _height: height,
      basicCanvas,
      number
    } = m;
    const scale = stageSize.x / basicCanvas.x;
    const top = stageSize.y / 2 - imageSize.y / 2;
    return {
      basicCanvas,
      number,
      startX: null,
      startY: null,
      width: width * scale,
      height: height * scale,
      anchors: findAnchorsByCorners(
        x * scale,
        y * scale + top,
        (x + width) * scale,
        (y + height) * scale + top
      ),
      corners: [
        x * scale,
        y * scale + top,
        (x + width) * scale,
        (y + height) * scale + top
      ]
    };
  });
}
  
  /** local end */