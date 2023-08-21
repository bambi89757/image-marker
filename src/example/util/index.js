/** local start */

const _flatServerMark = ({ position, number, ...attrs }) => {
  const { width, height, x, y, basicCanvas } = position;
  return {
    ...attrs,
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


/** local end */
/** server start */

// 转回提交格式中的position字段
const _convertToPosition = ({mark, imageSize}) => {
    const {width, height, corners} = mark;
    return {
      width,
      height,
      x: corners[0],
      y: corners[1],
      basicCanvas: {
        x: imageSize.x,
        y: imageSize.y
      }
    }
  }
  
const toServerMarks = (localMarks, serverMarks, imageSize) => {
    return serverMarks.map((one)=> {
      const position = _convertToPosition(localMarks[one.number], imageSize);
      return {
        ...one,
        position
      }
    })
  };
  
export default toServerMarks;
  /** server end */