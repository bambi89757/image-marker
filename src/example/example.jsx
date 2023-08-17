import React, { useEffect, useRef, useState } from "react";
import '@/assets/css/base.css';
import Marker from "@/components/marker/index.jsx";
import { useParams } from "react-router-dom";
import { getDraftDetail, getMarks } from "./mocks";
import { styled } from "styled-components";
import { getBase64Image } from "../components/marker/annotate/util";
import Annotate from "../components/marker/annotate";
import { Button } from "antd";
import {
    CommentOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    DownloadOutlined
  } from "@ant-design/icons";
import toLocalMarks, { flatServerMark, flatServerMarksToLocal } from "../components/marker/annotate/util/local";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  .tools {
    position: absolute;
    top: 20px;
    left: 0;
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

const Tools = ({draft, annotate}) => {
    const [imageBase64Url, setBase64] = useState("");
    const download = useRef();
    
    function downImage() {
      download.current.click();
    }
    useEffect(() => {
        getBase64Image(draft?.url, setBase64);
      }, [draft?.id]);
    return (
        <div className="tools">
            <div className="handle-bar">
            <Button
                type="text"
                shape={"circle"}
                icon={<CommentOutlined />}
                onClick={annotate.current?.handleMark || (()=> {})}
            />
            <Button
                type="text"
                shape={"circle"}
                icon={<ZoomInOutlined />}
                onClick={annotate.current?.handleZoomIn || (()=> {})}
            />
            <Button
                type="text"
                shape={"circle"}
                icon={<ZoomOutOutlined />}
                onClick={annotate.current?.handleZoomOut || (()=> {})}
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
            download={`${draft?.id}.${draft?.url?.split(".").reverse()[0]}`}
            ></a>
        </div>
    )
}

const Example = () => {
    const [draft, setDraft] = useState(null);
    const [marks, setMarks] = useState([]);
    const {id} = useParams();
    const annotate = useRef(null);

    async function getDetails(id) {
        const draftRes = await getDraftDetail(id);
        const marksRes = await getMarks(id);
        console.log('??? ', marksRes);
        setMarks(flatServerMarksToLocal(marksRes));
        setDraft(draftRes);
    }
    useEffect(()=> {
        getDetails(id);
    }, [])
    return (
        <Wrapper>
            <Tools draft={draft} annotate={annotate}/>
            {id && <Annotate ref={annotate} initialValue={marks} draft={draft} /> }
            <Marker draft={draft} value={marks} onChange={setMarks}/>
        </Wrapper>
    );
  };

export default Example;