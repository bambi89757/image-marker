import {
    CommentOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    DownloadOutlined,
    CloseOutlined
  } from "@ant-design/icons";
import { getBase64Image } from "../util";
import { Button, Divider } from "antd";
import { styled } from "styled-components";
import React, { useEffect, useRef, useState } from "react";

const Colors = ["#000000", "#0000ff", "#ff0000", "#00ff00", "#ff00ff", "#00ffff", "#ffff00", "#ffffff"]

const Wrapper = styled.div`
  position: relative;
  .tools {
    z-index: 99999;
    width: 100%;
    display: flex;
    justify-content: center;
    .handle-bar {
      display: inline-flex;
      align-items: center;
      padding: 6px;
      background: #ffffff;
      transition: all 0.5s ease;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      border: 1px solid #ebedf0;
    }
  }
`;

const Li = styled.li`
  width: 24px;
  height: 24px;
  border: 4px solid transparent;
  background-color: ${props => props.selected ? props.color + 80 : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-color: ${props => props.color};
  }
`;

const MarkBar = styled.div`
  display: inline-flex;
  align-items: center;
  .mark-bar-picker {
    display: inline-flex;
    ul {
      display: ${props => props.open ? 'inline-flex' : 'none'};
      transition: background .3s cubic-bezier(.645,.045,.355,1),margin-right .3s cubic-bezier(.645,.045,.355,1),border-radius .3s cubic-bezier(.645,.045,.355,1);
      background: ${props => props.open ? '#f0f0e9' : 'transparent'};
      margin-right: ${props => props.open ? '6px' : '0px'};
      border-radius: ${props => props.open ? '6px' : '0px'};
    } 
    .mark-bar-quit {
      display: ${props => props.open ? 'inline-block' : 'none'};
    }
  }
  .mark-bar-btn {
    display: ${props => props.open ? 'none' : 'block'};
  }
`;

export default ({picture, picAnnotate, children}) => {
    const [imageBase64Url, setBase64] = useState("");
    const [pickerIndex, setPickerIndex] = useState(0);
    const [isMarking, setMarking] = useState(false);
    const download = useRef();
    
    function downImage() {
      download.current.click();
    }
    useEffect(() => {
        getBase64Image(picture?.url, setBase64);
      }, [picture?.id]);

      useEffect(()=> {
        picAnnotate.current?.setMColor(Colors[pickerIndex])
      }, [pickerIndex])

      useEffect(()=> {
        picAnnotate.current?.handleMark(isMarking);
      }, [isMarking])
    return (
      <Wrapper>
        {children}
        <div className="tools">
            <div className="handle-bar">
              <MarkBar open={isMarking}>
                <div className="mark-bar-picker">
                  <ul className="clearfix">
                    {Colors.map((color, i)=>{
                      return <Li 
                                className="fl"
                                color={color}
                                selected={pickerIndex === i}
                                onClick={() => setPickerIndex(i)}
                              />
                    })}
                  </ul>
                  <Button
                    type="text"
                    shape={"circle"}
                    danger
                    className="mark-bar-quit"
                    onClick={()=> setMarking(false)}
                    icon={<CloseOutlined/>}
                  />
                </div>
                <Button
                  type="text"
                  shape={"circle"}
                  className="mark-bar-btn"
                  onClick={()=> setMarking(true)}
                  icon={<CommentOutlined />}
                />
              </MarkBar>

            
            <Divider type="vertical"/>
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