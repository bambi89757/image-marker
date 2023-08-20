import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Stage, Layer, Group, Image, Rect, Circle, Text } from "react-konva";
import styled from "styled-components";
import useImage from "use-image";
import _ from "lodash";
import { initialAnchors } from "./util/index";
export {default as ToolBar} from './components/toolbar';

const failedUrl = ' ';
export const DEFAULT_MAIN = "#ff3756";
export const DEFAULT_ANCHOR_BORDER = "#f96e84";
export const DEFAULT_ANCHOR_BACKGROUND = "#fff";
const defaultTheme = {
  main: DEFAULT_MAIN,
  anchor: {
    border: DEFAULT_ANCHOR_BORDER,
    backGround: DEFAULT_ANCHOR_BACKGROUND
  },
};
function getOuterWidth(element) {
  return element.parentElement?.clientWidth - parseFloat(getComputedStyle(element).borderLeftWidth) - parseFloat(getComputedStyle(element).borderRightWidth);
}

function getOuterHeight(element) {
  return element.parentElement?.clientHeight - parseFloat(getComputedStyle(element).borderTopWidth) - parseFloat(getComputedStyle(element).borderBottomWidth);
}


const Wrapper = styled.div`
  position: relative;
  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;



function PicAnnotate({initialValue, onChange, picture, theme = defaultTheme,...props}, ref) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [marksInitialized, setMarksInitialized] = useState(false);
  const [marks, setMarks] = useState([]);
  const [currentMarkIndex, setCurrent] = useState(-1);


  const [mode, setMode] = useState("normal");
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageSize, setStageSize] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ x: 0, y: 0 });
  const [activePos, setActivePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [hoverMark, setHoverMark] = useState(-1);
  const [currentAnchorIndex, setAnchorIndex] = useState(-1);
  const [onDrawing, setOnceDraw] = useState(false);
  const [onChanging, setOnceChange] = useState(false);
  const [onLocating, setOnceLocate] = useState(false);
  const [onMoveStage, setOnceMoveStage] = useState(false);
  const [movePos, setMovePos] = useState({ x: 0, y: 0 });

  const [image, imageStatus] = useImage(picture?.url || failedUrl);
  const stage = useRef();
  const wrapper = useRef();
  const top = useMemo(()=> {
    return stageSize.y / 2 - imageSize.y / 2;
  }, [stageSize.y, imageSize.y])
  const left = useMemo(()=> {
    return stageSize.x / 2 - imageSize.x / 2;
  }, [stageSize.x, imageSize.x]);

  function handleResize() {
    let outerWidth = getOuterWidth(wrapper.current);
    let outerHeight = getOuterHeight(wrapper.current);
    setStageSize({
      x: outerWidth,
      y: outerHeight
    });
  }

  function handleMark() {
    setMode("mark");
  }

  function handleWheel(e) {
    e.evt.preventDefault();
    zoom(stage.current.getPointerPosition(), 1.1, e.evt.deltaY < 0);
  }

  function handleZoomIn() {
    zoom(
      {
        x: stage.current.width() * 0.5 + stagePos.x,
        y: stage.current.height() * 0.5 + stagePos.y
      },
      1.2,
      true
    );
  }

  function handleZoomOut() {
    zoom(
      {
        x: stage.current.width() * 0.5 + stagePos.x,
        y: stage.current.height() * 0.5 + stagePos.y
      },
      1.2,
      false
    );
  }



  function handleMousedown(e) {
    if (e.target.attrs.name === "marker" || e.target.attrs.name === "mark") {
      changePositionStart(e.target.attrs.index);
    } else if (e.target.attrs.name === "anchor") {
      changeAnchorStart(e.target.attrs.local[0], e.target.attrs.local[1]);
    } else {
      if (mode === "mark") {
        addSelectStart();
      } else {
        moveStageStart();
      }
    }
  }

  function handleMousemove() {
    if (onLocating) {
      changePosition();
    } else if (onChanging) {
      changeAnchor();
    } else {
      if (mode === "mark") {
        if (onDrawing) {
          addSelect();
        }
      } else {
        if (onMoveStage) {
          moveStage();
        }
      }
    }
  }

  function handleMouseup() {
    setMode("normal");
    moveStageEnd();
    changePositionEnd();
    changeAnchorEnd();
    addSelectEnd();
    setStart(null, null);
  }

  function addSelectStart() {
    if (onDrawing) return;
    setOnceDraw(true);
    let positionX =
      (stage.current.getPointerPosition().x - stagePos.x) / scale;
    let positionY =
      (stage.current.getPointerPosition().y - stagePos.y) / scale;
    let mark = {
      width: 0,
      height: 0,
      startX: positionX,
      startY: positionY,
      corners: [positionX, positionY],
      number: marks.length,
      anchors: []
    };
    setMarks([...marks, mark]);
    setCurrent(marks.length);
  }

  function addSelect() {
    let x = (stage.current.getPointerPosition().x - stagePos.x) / scale;
    let y = (stage.current.getPointerPosition().y - stagePos.y) / scale;
    let tempMarkList = _.cloneDeep(marks);
    tempMarkList[currentMarkIndex].width = Math.abs(
      x - tempMarkList[currentMarkIndex].startX
    );
    tempMarkList[currentMarkIndex].height = Math.abs(
      y - tempMarkList[currentMarkIndex].startY
    );
    tempMarkList[currentMarkIndex].corners = findWhichIsFirstPoint(
      tempMarkList[currentMarkIndex].startX,
      tempMarkList[currentMarkIndex].startY,
      x,
      y
    );
    tempMarkList[currentMarkIndex].anchors = findAnchorsByCorners(
      tempMarkList[currentMarkIndex].corners[0],
      tempMarkList[currentMarkIndex].corners[1],
      tempMarkList[currentMarkIndex].corners[2],
      tempMarkList[currentMarkIndex].corners[3]
    );
    setMarks(tempMarkList);
    tempMarkList = null;
  }

  function addSelectEnd() {
    if (onDrawing) {
      moveModal(
        marks[currentMarkIndex].corners[1],
        marks[currentMarkIndex].corners[2]
      );
      setOnceDraw(false);
    }
  }

  function changeAnchorStart(i, index) {
    if (onChanging) return;
    setCurrent(index);
    setAnchorIndex(i);
    let { x, y } = marks[index].anchors[i].relative;
    setStart(x, y, index);
    setOnceChange(true);
  }

  function changeAnchor() {
    if (onChanging && currentAnchorIndex > -1) {
      let tempMarkList = _.cloneDeep(marks);
      let currentAnchor =
        tempMarkList[currentMarkIndex].anchors[currentAnchorIndex];
      let x, y;

      switch (currentAnchor.type) {
        case "corner":
          x =
            (stage.current.getPointerPosition().x - stagePos.x) / scale;
          y =
            (stage.current.getPointerPosition().y - stagePos.y) / scale;
          tempMarkList[currentMarkIndex].width = Math.abs(
            x - tempMarkList[currentMarkIndex].startX
          );
          tempMarkList[currentMarkIndex].height = Math.abs(
            y - tempMarkList[currentMarkIndex].startY
          );
          tempMarkList[currentMarkIndex].corners = findWhichIsFirstPoint(
            tempMarkList[currentMarkIndex].startX,
            tempMarkList[currentMarkIndex].startY,
            x,
            y
          );
          break;
        case "x-edge":
          x =
            (stage.current.getPointerPosition().x - stagePos.x) / scale;
          tempMarkList[currentMarkIndex].width = Math.abs(
            x - tempMarkList[currentMarkIndex].startX
          );
          tempMarkList[currentMarkIndex].corners = findWhichIsFirstPoint(
            tempMarkList[currentMarkIndex].startX,
            tempMarkList[currentMarkIndex].corners[1],
            x,
            tempMarkList[currentMarkIndex].corners[3]
          );
          break;
        case "y-edge":
          y =
            (stage.current.getPointerPosition().y - stagePos.y) / scale;
          tempMarkList[currentMarkIndex].height = Math.abs(
            y - tempMarkList[currentMarkIndex].startY
          );
          tempMarkList[currentMarkIndex].corners = findWhichIsFirstPoint(
            tempMarkList[currentMarkIndex].corners[0],
            tempMarkList[currentMarkIndex].startY,
            tempMarkList[currentMarkIndex].corners[2],
            y
          );
          break;
        default:
          return;
      }

      tempMarkList[currentMarkIndex].anchors = findAnchorsByCorners(
        tempMarkList[currentMarkIndex].corners[0],
        tempMarkList[currentMarkIndex].corners[1],
        tempMarkList[currentMarkIndex].corners[2],
        tempMarkList[currentMarkIndex].corners[3]
      );
      setMarks(tempMarkList);
      tempMarkList = null;
    }
  }

  function changeAnchorEnd() {
    if (onChanging) {
      moveModal(
        marks[currentMarkIndex].corners[1],
        marks[currentMarkIndex].corners[2]
      );
      setOnceChange(false);
    }
  }

  function changePositionStart(index) {
    if (onLocating) return;
    let x = (stage.current.getPointerPosition().x - stagePos.x) / scale;
    let y = (stage.current.getPointerPosition().y - stagePos.y) / scale;
    setMovePos({ x, y });
    setCurrent(index);
    setOnceLocate(true);
  }

  function changePosition() {
    if (onLocating) {
      let tempMarkList = _.cloneDeep(marks);
      let x =
        (stage.current.getPointerPosition().x - stagePos.x) / scale;
      let y =
        (stage.current.getPointerPosition().y - stagePos.y) / scale;
      tempMarkList[currentMarkIndex].corners = findTranslatePoint(
        x - movePos.x,
        y - movePos.y,
        tempMarkList[currentMarkIndex].corners
      );
      setMovePos({ x, y });
      tempMarkList[currentMarkIndex].anchors = findAnchorsByCorners(
        tempMarkList[currentMarkIndex].corners[0],
        tempMarkList[currentMarkIndex].corners[1],
        tempMarkList[currentMarkIndex].corners[2],
        tempMarkList[currentMarkIndex].corners[3]
      );
      setMarks(tempMarkList);
      tempMarkList = null;
    }
  }

  function changePositionEnd() {
    if (onLocating) {
      moveModal(
        marks[currentMarkIndex].corners[1],
        marks[currentMarkIndex].corners[2]
      );
      setMovePos({ x: 0, y: 0 });
      setOnceLocate(false);
    }
  }

  function moveStageStart() {
    if (onMoveStage) return;
    let x = stage.current.getPointerPosition().x - stagePos.x;
    let y = stage.current.getPointerPosition().y - stagePos.y;
    setMovePos({ x, y });
    setOnceMoveStage(true);
  }

  function moveStage() {
    if (onMoveStage) {
      let x =
        stage.current.getPointerPosition().x - movePos.x;
      let y =
        stage.current.getPointerPosition().y - movePos.y;
      setStagePos({
        x,
        y
      });
    }
  }

  function moveStageEnd() {
    console.log('moveStageEnd', stagePos, stagePos.x, stagePos.y)
    setMovePos({ x: 0, y: 0 });
    setOnceMoveStage(false);
  }

  function hover(e, flag) {
    if (e.target.attrs.name === "mark" || e.target.attrs.name === "marker") {
      if (flag) {
        document.body.style.cursor = "move";
      } else {
        document.body.style.cursor = "default";
      }
    } else if (e.target.attrs.name === "anchor") {
      if (flag) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    } else {
      document.body.style.cursor = "default";
    }

    if (e.target.attrs.name === "anchor" || e.target.attrs.name === "marker") {
      if (flag) {
        setHoverMark(e.target.attrs.index);
      }
    } else {
      setHoverMark(null);
    }
  }

  function setStart(startX, startY, index = currentMarkIndex) {
    if (onMoveStage) return;
    let tempMarkList = _.cloneDeep(marks);
    tempMarkList[index].startX = startX;
    tempMarkList[index].startY = startY;
    setMarks(tempMarkList);
    tempMarkList = null;
  }

  // 输入四角坐标值，判断哪个坐标值离左上角最近，其中特殊情况需要进行坐标查找工作
  function findWhichIsFirstPoint(x1, y1, x2, y2) {
    // 首先判断x轴的距离谁更近
    if (x1 <= x2) {
      // 说明x1 比较小,接下来判断y谁更近
      if (y1 <= y2) {
        // 说明第一个坐标离得更近，直接顺序return就好
        return [x1, y1, x2, y2];
      } else {
        // 这里遇见一个奇葩问题，需要进行顶角变换
        return [x1, y2, x2, y1];
      }
    } else {
      // 这里是x1 大于 x2 的情况
      if (y2 <= y1) {
        return [x2, y2, x1, y1];
      } else {
        // y2 大于 y1 的情况, 这里需要做顶角变换工作
        return [x2, y1, x1, y2];
      }
    }
  }
  // 输入调整过的四角坐标值，计算出所有锚点位置
  function findAnchorsByCorners(x1, y1, x2, y2) {
    return [
      {
        type: "corner",
        relative: {
          x: x2,
          y: y2
        },
        x: x1,
        y: y1
      },
      {
        type: "corner",
        relative: {
          x: x1,
          y: y2
        },
        x: x2,
        y: y1
      },
      {
        type: "corner",
        relative: {
          x: x2,
          y: y1
        },
        x: x1,
        y: y2
      },
      {
        type: "corner",
        relative: {
          x: x1,
          y: y1
        },
        x: x2,
        y: y2
      },
      {
        type: "y-edge",
        relative: {
          y: y2
        },
        x: x1 + (x2 - x1) / 2,
        y: y1
      },
      {
        type: "y-edge",
        relative: {
          y: y1
        },
        x: x1 + (x2 - x1) / 2,
        y: y2
      },
      {
        type: "x-edge",
        relative: {
          x: x2
        },
        x: x1,
        y: y1 + (y2 - y1) / 2
      },
      {
        type: "x-edge",
        relative: {
          x: x1
        },
        x: x2,
        y: y1 + (y2 - y1) / 2
      }
    ];
  }

  // 输入四角坐标值，判断哪个坐标值离左上角最近，其中特殊情况需要进行坐标查找工作
  function findTranslatePoint(x, y, corners) {
    return [corners[0] + x, corners[1] + y, corners[2] + x, corners[3] + y];
  }

  // 放大缩小
  function zoom(centralPoint, scaleBy, isZoomIn = true) {
    setScale(scale => {
      let oldScale = scale;
      let newScale = isZoomIn ? oldScale * scaleBy : oldScale / scaleBy;
      let zoomPoint = {
        x: centralPoint.x / oldScale - stage.current.x() / oldScale,
        y: centralPoint.y / oldScale - stage.current.y() / oldScale
      };
      let newPos = {
        x: (centralPoint.x / newScale - zoomPoint.x) * newScale,
        y: (centralPoint.y / newScale - zoomPoint.y) * newScale
      };

      setStagePos(newPos);
      return newScale;
    })
  }

  // 移动modal
  function moveModal(y1, x2) {
    let { left, top } = stage.current.content.getBoundingClientRect();
    let x = stagePos.x + x2 * scale + left;
    let y = stagePos.y + y1 * scale + top;
    setActivePos({ x, y });
  }

  useEffect(() => {
    console.log(wrapper.current);
    const outer = wrapper.current.parentElement;
    handleResize();
    outer.onresize = handleResize;
    return () => {
      outer.onresize = null;
    }
  }, []);

  useEffect(() => {
    if (image?.naturalWidth && image?.naturalHeight && stageSize.x) {
      let width = stageSize.x * 1;
      let height = stageSize.y * 1;
      const imageWH = image.naturalWidth / image.naturalHeight;
      const outerWH = width / height;
      if (imageWH < outerWH) {
        width = height * imageWH;
      } else {
        height = width / imageWH;
      }
      setImageSize({
        x: width,
        y: height
      });
      setImageLoaded(true);
    }
  }, [image, stageSize.x]);

  useEffect(() => {
    if (stageSize.x && imageSize.x && initialValue?.length && imageLoaded && marksInitialized === false) {
      const value = initialValue || [];
      setMarks(initialAnchors(value, stageSize, imageSize));
      setMarksInitialized(true);
    }
  }, [stageSize.x, imageSize.x, initialValue, imageLoaded]);

  useEffect(() => {
    if (currentMarkIndex > -1) {
      moveModal(
        marks[currentMarkIndex].corners[1],
        marks[currentMarkIndex].corners[2]
      );
    }
  }, [currentMarkIndex]);

  useEffect(()=> {
    onChange && onChange(_.cloneDeep(marks));
  }, [marks])

  useImperativeHandle(ref, () => ({
    handleMark,
    handleZoomIn,
    handleZoomOut,
    setValue: setMarks,
    getValue: () => _.cloneDeep(marks),
    activePos,
    activeIndex: currentMarkIndex,
    active: currentMarkIndex > -1 &&
    !onDrawing &&
    !onChanging &&
    !onLocating &&
    !onMoveStage
  }), [scale]);

  return (
    <Wrapper {...props} ref={wrapper} style={{
      width: stageSize.x + 'px',
      height: stageSize.y + 'px',
    }}>
      <button 
        onClick={() => {
          console.log('stageSize', stageSize);
          console.log('stagePos', stagePos);
          const getClientRect = stage.current.getClientRect({ skipTransform: true})
          const size = stage.current.size();
          const width = stage.current.width();
          const height = stage.current.height();
          const x = stage.current.x();
          const y = stage.current.y();
          console.log('width height', width, height);
          console.log('x y', x, y);
        }} 
        style={{
          position: 'fixed',
          top:0,
          left:0,
          zIndex: 99999
        }}
      >打印</button>
      {
        imageLoaded ? 
        <Stage
          ref={stage}
          x={stagePos.x}
          y={stagePos.y}
          scale={{ x: scale, y: scale }}
          width={stageSize.x}
          height={stageSize.y}
          onWheel={handleWheel}
          onMouseDown={handleMousedown}
          onMouseMove={handleMousemove}
          onMouseUp={handleMouseup}
          onMouseOver={e => hover(e, true)}
          onMouseOut={e => hover(e, false)}
        >
          <Layer>
            <Image
              image={image}
              x={stageSize.x / 2 - imageSize.x / 2}
              y={stageSize.y / 2 - imageSize.y / 2}
              width={imageSize.x}
              height={imageSize.y}
            ></Image>
            {marks.map((mark, index) => (
              <Group key={index}>
                <Rect
                  name="marker"
                  index={index}
                  x={mark.corners[0]}
                  y={mark.corners[1]}
                  width={mark.width}
                  height={mark.height}
                  stroke={theme.main}
                  strokeWidth={3}
                ></Rect>
                <Group
                  visible={index === currentMarkIndex || index === hoverMark}
                >
                  {mark.anchors.map((anchor, i) => (
                    <Circle
                      name="anchor"
                      index={index}
                      key={i}
                      x={anchor.x}
                      y={anchor.y}
                      radius={4}
                      fill={theme?.anchor?.backGround || defaultTheme?.anchor?.backGround }
                      stroke={theme?.anchor?.border || defaultTheme?.anchor?.border }
                      local={[i, index]}
                    />
                  ))}
                </Group>
                <Group>
                  <Circle
                    name="mark"
                    index={index}
                    x={mark.corners[0]}
                    y={mark.corners[1]}
                    radius={8}
                    fill={theme?.anchor?.backGround || defaultTheme?.anchor?.backGround }
                    stroke={theme?.anchor?.border || defaultTheme?.anchor?.border }
                    strokeWidth={2}
                  />
                  <Text
                    name="mark"
                    index={index}
                    x={mark.corners[0] - 3}
                    y={mark.corners[1] - 5}
                    text={mark.number + 1}
                    fontStyle="bold"
                    fill={theme.main}
                    align="left"
                    verticalAlign="middle"
                  />
                </Group>
              </Group>
            ))}
          </Layer>
        </Stage> : 
        <div className="placeholder">
          {imageStatus === "loading" && picture?.url && "载入中..."}
          {imageStatus === "failed" && "载入失败..."}
        </div>
      }
    </Wrapper>
  );
}

export default forwardRef(PicAnnotate);

