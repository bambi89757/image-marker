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
      number,
      ...attrs
    } = m;
    const scale = imageSize.x / basicCanvas.x;
    const top = stageSize.y / 2 - imageSize.y / 2;
    const left = stageSize.x / 2 - imageSize.x / 2;
    return {
      ...attrs,
      basicCanvas,
      number,
      startX: null,
      startY: null,
      width: width * scale,
      height: height * scale,
      anchors: findAnchorsByCorners(
        x * scale + left,
        y * scale + top,
        (x + width) * scale + left,
        (y + height) * scale + top
      ),
      corners: [
        x * scale + left,
        y * scale + top,
        (x + width) * scale + left,
        (y + height) * scale + top
      ]
    };
  });
}
  
  /** local end */