import React, { useEffect, useRef, useState } from "react";
import '@/assets/css/base.css';
import { useParams } from "react-router-dom";
import { getPictureDetail, getPictures, getMarks } from "./mocks";
import PicAnnotate, { ToolBar, DEFAULT_MAIN, DEFAULT_ANCHOR_BORDER } from "../marker";
import { flatServerMarksToLocal } from "./util";
import Detail from "./detail";
import { styled } from "styled-components";

const reId = /^\d+$/;


const ContainerWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  .left-bar {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 200px;
    height: 100%;
    ul {
      clear: both;
      height: 100%;
      overflow: auto;
      overflow: overlay;
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        float: left;
        width: 100%;
        height: 160px;
        cursor: pointer;
      }
    }
  }
  .right-content {
    margin-left: 200px;
    width: calc(100% - 200px);
    height: 100%;
  }
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 100%;
  border: 10px solid${props => props.active ? DEFAULT_MAIN: DEFAULT_ANCHOR_BORDER};
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PicWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  .stage {
    border: 10px dashed ${DEFAULT_MAIN};
  }
`;

const Example = () => {
    const [picture, setPicture] = useState(null);
    const [marks, setMarks] = useState([]);
    const [pictureList, setPictureList] = useState(null);

    const {id} = useParams();
    const picAnnotate = useRef(null);

    async function getDetails(id) {
        const pictureRes = await getPictureDetail(id);
        const marksRes = await getMarks(id);
        setMarks(flatServerMarksToLocal(marksRes));
        setPicture(pictureRes);
        const pictureList = await getPictures();
        setPictureList(pictureList);
    }
    useEffect(()=> {
        getDetails(id);
    }, [])
    return (
      <>
      <ContainerWrapper>
        <div className="left-bar">
          <ul>
            {pictureList?.map(one => {
              return (
                <li  onClick={() => {
                  getPictureDetail(one.id).then((pictureRes)=> {
                    setPicture(pictureRes)
                  });
                }}>
                  <ItemWrapper active={one.id == picture?.id}>
                    <img src={one.url} alt="" />
                  </ItemWrapper>
                </li>
              )
            })}
            
          </ul> 
        </div>
        <div className="right-content">
          <PicWrapper>
              <PicAnnotate ref={picAnnotate} initialValue={marks} picture={picture} className="stage"/>
          </PicWrapper>
          <ToolBar picture={picture} picAnnotate={picAnnotate} />
          <Detail picture={picture} value={marks} onChange={setMarks}/>  
        </div>
      </ContainerWrapper>
      </>
    );
  };

export default Example;