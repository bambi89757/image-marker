

/** server start */

// 转回提交格式中的position字段
const _convertToPosition = ({mark, stageSize}) => {
    const {width, height, corners} = mark;
    return {
      width,
      height,
      x: corners[0],
      y: corners[1],
      basicCanvas: {
        x: stageSize.x,
        y: stageSize.y
      }
    }
  }
  
const toServerMarks = (localMarks, serverMarks, stageSize) => {
    return serverMarks.map((one)=> {
      const position = _convertToPosition(localMarks[one.number], stageSize);
      return {
        ...one,
        position
      }
    })
  };
  
export default toServerMarks;
  /** server end */