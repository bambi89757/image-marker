import React, { useEffect, useRef, useState } from "react";
import '@/assets/css/base.css';
import { useParams } from "react-router-dom";
import { getPictureDetail, getMarks } from "./mocks";
import PicAnnotate, { ToolBar } from "../marker";
import { flatServerMarksToLocal } from "./util";
import Detail from "./detail";

const reId = /^\d+$/;

const Example = () => {
    const [picture, setPicture] = useState(null);
    const [marks, setMarks] = useState([]);
    const {id} = useParams();
    const picAnnotate = useRef(null);

    async function getDetails(id) {
        const pictureRes = await getPictureDetail(id);
        const marksRes = await getMarks(id);
        setMarks(flatServerMarksToLocal(marksRes));
        setPicture(pictureRes);
    }
    useEffect(()=> {
        getDetails(id);
    }, [])
    return (
      <>
        <ToolBar picture={picture} picAnnotate={picAnnotate}>
          <PicAnnotate ref={picAnnotate} initialValue={marks} picture={picture} />
        </ToolBar>
        <Detail picture={picture} value={marks} onChange={setMarks}/>
      </>
    );
  };

export default Example;