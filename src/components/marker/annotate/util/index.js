
import toLocalMarks from './local';
import toServerMarks from './server';
/** utils start */

// 输入四角坐标值，判断哪个坐标值离左上角最近，其中特殊情况需要进行坐标查找工作
export const findWhichIsFirstPoint = (x1, y1, x2, y2) => {
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
};
// 输入调整过的四角坐标值，计算出所有锚点位置
export const findAnchorsByCorners = (x1, y1, x2, y2) => {
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
};

// 输入四角坐标值，判断哪个坐标值离左上角最近，其中特殊情况需要进行坐标查找工作
export const findTranslatePoint = (x, y, corners) => {
  return [corners[0] + x, corners[1] + y, corners[2] + x, corners[3] + y];
};

// 图片下载
export function getBase64Image(src, fn) {
  let img = new Image();
  img.src = src;
  img.crossOrigin = '*'
  img.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    let dataURL = canvas.toDataURL('image/' + ext);
    fn(dataURL);
  }
}

export default {
  toLocalMarks,
  toServerMarks
}

/** utils end */

