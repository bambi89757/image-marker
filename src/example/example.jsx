import React, { useEffect, useRef, useState } from "react";
import '@/assets/css/base.css';
import { useParams } from "react-router-dom";
import { getDraftDetail, getMarks } from "./mocks";
import PicAnnotate, { ToolBar } from "../marker";
import { flatServerMarksToLocal } from "./util";
import Detail from "./detail";

const reId = /^\d+$/;

const Example = () => {
    const [picture, setDraft] = useState(null);
    const [marks, setMarks] = useState([]);
    const {id} = useParams();
    const picAnnotate = useRef(null);

    async function getDetails(id) {
        const pictureRes = await getDraftDetail(id);
        const marksRes = await getMarks(id);
        setMarks(flatServerMarksToLocal(marksRes));
        setDraft(pictureRes);
    }
    useEffect(()=> {
        getDetails(id);
    }, [])
    return (
      <>
        <ToolBar picture={picture} picAnnotate={picAnnotate}>
          {reId.test(id) && <PicAnnotate ref={picAnnotate} initialValue={marks} picture={picture} /> }
        </ToolBar>
        <Detail picture={picture} value={marks} onChange={setMarks}/>
      </>
    );
  };

export default Example;