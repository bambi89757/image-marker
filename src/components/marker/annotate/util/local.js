import { findAnchorsByCorners } from ".";

/** local start */
const _flatServerMark = ({ position, number }) => {
    const { width, height, x, y, basicCanvas } = position;
    return {
      _width: width,
      _height: height,
      _x: x,
      _y: y,
      width: 0,
      height: 0,
      basicCanvas,
      startX: null,
      startY: null,
      corners: [-50, -50],
      number,
      anchors: []
    };
  };

  export const flatServerMarksToLocal = (serverMarks) => {
    let marks = [];
    for (let i = 0; i < serverMarks.length; i++) {
      // 根据number确定唯一性，server与local可能是多对一或一对一
      marks[serverMarks[i].number] = marks[serverMarks[i].number] || {
        ..._flatServerMark(serverMarks[i])
      };
    }
    return marks;
  }
  
export const initialAnchors = (flatMarks, stageSize) => {
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
  
  
const toLocalMarks = (serverMarks, stageSize) => {
    let marks = [];
    for (let i = 0; i < serverMarks.length; i++) {
      marks[serverMarks[i].number] = marks[serverMarks[i].number] || {
        ..._flatServerMark(serverMarks[i])
      };
    }
    return initialAnchors(marks, stageSize);
  };
  

export default toLocalMarks;
  
  /** local end */