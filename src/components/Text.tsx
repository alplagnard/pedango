import React from "react";
import { textType } from "../common/types"

export const Word = (props: textType) => {
  const text = props.wiki;
  const list = props.list;
  const listNumber = props.listNumber;
  const almostList = props.almostList;
  const reveal = props.reveal;
  const sent = props.sent;

  return (
    <div className='App-align2' key="Word">
      {
        text.map((word: string, i: number) => word.match(/[・。、/＃！＄％^＆＊；：『」＝＿’〜（）()=]/) ?
          <div key={i}>{word}</div> : word === sent ?
            <div className="App-right" key={i}>{word}</div>
            : (!list.includes(word) && !listNumber.includes(parseInt(word))) || reveal ?
              <div key={i}>{word}</div> : almostList.get(word) !== 'z' ?
                <div className="App-almost" key={i}>{almostList.get(word)}</div> :
                <div className='App-word' key={i}>{word}</div>)
      }
    </div>
  );
}