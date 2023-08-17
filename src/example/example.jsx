import React, { useEffect, useRef, useState } from "react";
import '@/assets/css/base.css';
import { useParams } from "react-router-dom";
import { getDraftDetail, getMarks } from "./mocks";
import Annotate, { ToolBar } from "../marker";
import { flatServerMarksToLocal } from "./util";
import Detail from "./detail";

const Example = () => {
    const [draft, setDraft] = useState(null);
    const [marks, setMarks] = useState([]);
    const {id} = useParams();
    const annotate = useRef(null);

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
        <ToolBar draft={draft} annotate={annotate}>
          {id && <Annotate ref={annotate} initialValue={marks} draft={draft} /> }
        </ToolBar>
        <Detail draft={draft} value={marks} onChange={setMarks}/>
      </>
    );
  };

export default Example;