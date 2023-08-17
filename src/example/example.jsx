import React, { useEffect, useRef, useState } from "react";
import '@/assets/css/base.css';
import { useParams } from "react-router-dom";
import { getDraftDetail, getMarks } from "./mocks";
import PicAnnotate, { ToolBar } from "../marker";
import { flatServerMarksToLocal } from "./util";
import Detail from "./detail";

const reId = /^\d+$/;

const Example = () => {
    const [draft, setDraft] = useState(null);
    const [marks, setMarks] = useState([]);
    const {id} = useParams();
    const picAnnotate = useRef(null);

    async function getDetails(id) {
        const draftRes = await getDraftDetail(id);
        const marksRes = await getMarks(id);
        setMarks(flatServerMarksToLocal(marksRes));
        setDraft(draftRes);
    }
    useEffect(()=> {
        getDetails(id);
    }, [])
    return (
      <>
        <ToolBar draft={draft} picAnnotate={picAnnotate}>
          {reId.test(id) && <PicAnnotate ref={picAnnotate} initialValue={marks} draft={draft} /> }
        </ToolBar>
        <Detail draft={draft} value={marks} onChange={setMarks}/>
      </>
    );
  };

export default Example;