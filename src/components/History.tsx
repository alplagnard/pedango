import React from "react";
import { historyType } from '../common/types';

export const History = (props: historyType) => {
    const history = props.history;
    const slicedHistory = history.slice(0, 10);
    const allHistory = false;

    return (
        <div className='App-history' key='History'>
            <h3 className='App-res2'>履歴</h3>
            <ol reversed>
                {
                    allHistory ? history.map((word: string, i: number) =>
                        <div key={i}> {history.length - i}. {word}</div>
                    ) : slicedHistory.map((word: string, i: number) =>
                        <div key={i}> {history.length - i}. {word}</div >
                    )}
            </ol>
        </div>
    );
}