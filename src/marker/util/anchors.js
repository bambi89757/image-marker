import { findAnchorsByCorners } from ".";

/** local start */
export default (flatMarks, stageSize) => {
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
    return {
      basicCanvas,
      number,
      startX: null,
      startY: null,
      width: width * scale,
      height: height * scale,
      anchors: findAnchorsByCorners(
        x * scale,
        y * scale,
        (x + width) * scale,
        (y + height) * scale
      ),
      corners: [
        x * scale,
        y * scale,
        (x + width) * scale,
        (y + height) * scale
      ]
    };
  });
}
  
  /** local end */