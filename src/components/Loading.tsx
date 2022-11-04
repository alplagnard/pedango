import React from "react";

export const Loading = () => {
    return (
        <div className='App-loading'>
            <p className='App-search'>LOADING...</p>
            <br />
            <div>このゲームの目的は、ウィキペディアの紹介文を構成する単語を次々に明らかにして、秘密のページを見つけることです。</div>
            <br />
            <div>正解の単語は、あなたが推測すると、はっきりと表示されます。近い単語はグレーアウトしたままです。</div>
            <br />
            <div>ウィキペディアのページのタイトルを構成する単語が明らかになったら、あなたの勝ちです。</div>
        </div>
    );
}