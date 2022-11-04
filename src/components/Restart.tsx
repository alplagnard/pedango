import React from "react";
import { restartType } from "../common/types";

export const Restart = (props: restartType) => {
  const title = props.title;
  const loading = props.loading;
  const lose = props.lose;
  const url = props.url;
  const restart = props.restart;
  const reveal = props.reveal;
  const update = props.update;

  const test = () => {
    update(!reveal);
  }
  return (
    <div className="App-final-res" key="Restart">
      {
        lose ?
          <div>
            <h3>残念😔</h3>
            <div className='App-align'>
              <a href={url} target="_blank" rel='noreferrer'>Wikipedia</a>
              <div>のページを見るには -</div>
              <div className='App-restart' onClick={restart}>再起動</div>
            </div>
          </div> :
          title.length === 0 && loading ?
            // <div className="App-final-res">
            <div>
              <div className='App-align'>
                <h3>やった!!!🎉🥳</h3>
                <form>
                  <input type="checkbox" id="reveal" name="reveal" onChange={test} />
                  <label id="revealWord">言葉を吐く</label>
                </form>
              </div>
              <div className='App-align'>
                <a href={url} target="_blank" rel='noreferrer'>Wikipedia</a>
                <div>のページを見るには -</div>
                <div className='App-restart' onClick={restart}>再起動</div>
              </div>
            </div> :
            null
      }
    </div>
  );
}