import React from "react";
import { titleType } from "../common/types";

export const Title = (props: titleType) => {
    const wiki = props.wiki;
    const title = props.title;
    const reg = props.reg;
    const listNumber = props.listNumber;
    const almostList = props.almostList;
    const reveal = props.reveal;
    const sent = props.sent;

    return (
        <div className='App-align-title' key="Title">
            <div className='App-align2'>
                {
                    wiki.map((word: string, i: number) => word.match(reg) ?
                        <div key={i}>
                            {word}
                        </div> : word === sent ?
                            <div className="App-right" key={i}>{word}</div>
                            : (!title.includes(word) && !listNumber.includes(parseInt(word))) || reveal ?
                                <div key={i}>{word}</div> : almostList.get(word) !== 'z' ?
                                    <div className="App-almost" key={i}>{almostList.get(word)}</div> :
                                    <div className='App-word' key={i}>{word}</div>
                    )
                }
            </div>
        </div>
    );
}


