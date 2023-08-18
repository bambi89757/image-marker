import {
    CommentOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    DownloadOutlined
  } from "@ant-design/icons";
import { getBase64Image } from "../util";
import { Button } from "antd";
import { styled } from "styled-components";
import React, { useEffect, useRef, useState } from "react";

const Wrapper = styled.div`
  position: relative;
  .tools {
    z-index: 99999;
    width: 100%;
    display: flex;
    justify-content: center;
    .handle-bar {
      padding: 6px;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      border: 1px solid #ebedf0;
    }
  }
`;

export default ({picture, picAnnotate, children}) => {
    const [imageBase64Url, setBase64] = useState("");
    const download = useRef();
    
    function downImage() {
      download.current.click();
    }
    useEffect(() => {
        getBase64Image(picture?.url, setBase64);
      }, [picture?.id]);
    return (
      <Wrapper>
        {children}
        <div className="tools">
            <div className="handle-bar">
            <Button
                type="text"
                shape={"circle"}
                icon={<CommentOutlined />}
                onClick={picAnnotate.current?.handleMark || (()=> {})}
            />
            <Button
                type="text"
                shape={"circle"}
                icon={<ZoomInOutlined />}
                onClick={picAnnotate.current?.handleZoomIn || (()=> {})}
            />
            <Button
                type="text"
                shape={"circle"}
                icon={<ZoomOutOutlined />}
                onClick={picAnnotate.current?.handleZoomOut || (()=> {})}
            />
            <Button
                type="text"
                shape={"circle"}
                icon={<DownloadOutlined />}
                onClick={downImage}
            />
            </div>
            <a
            ref={download}
            href={imageBase64Url}
            download={`${picture?.id}.${picture?.url?.split(".").reverse()[0]}`}
            ></a>
        </div>
        
      </Wrapper>
    )
}