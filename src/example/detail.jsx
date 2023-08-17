import React, { Suspense } from "react";

function Content({id, picture, value, onChange}) {
    return (
        <>
            <button onClick={()=> {
                const newValue = JSON.parse(JSON.stringify(value));
                const copyValue = JSON.parse(JSON.stringify(value));
                newValue.push(copyValue[0]);
                onChange(newValue);
            }}>onChange</button>
            <p>稿件ID：{id}</p>
            <p>稿件信息：{JSON.stringify(picture, undefined, 4)}</p>
            <p>稿件内容：{JSON.stringify(value, undefined, 4)}</p>
        </>
    )
}

function Loading() {
    return<div>loading...</div>
}

function Detail({key, picture, value, onChange}) {
    return (
        <Suspense fallback={<Loading />}>
            <Content id={key} picture={picture} value={value} onChange={onChange}/>
        </Suspense>
    )
}

export default Detail;