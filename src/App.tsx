import './view/view.css';
import axios from "axios";
import React from "react";
import TinySegmenter from "tiny-segmenter";
import { useEffect, useState } from "react";
import { wikiFinalName, wikiType, similarType } from "./common/types";
import { History } from "./components/History";
import { Title } from "./components/Title";
import { Restart } from "./components/Restart";
import { Word } from "./components/Text";
import { Loading } from "./components/Loading";


// Checker les mots rentrer (Tous mots non connus)
// Add explanation
// Use regex to split the numbers in the text
// Separate Server and Front in docker container
// Add database to Docker
// CSS
// Manage multiple call server side: https://www.digitalocean.com/community/tutorials/how-to-use-multithreading-in-node-js
// convert to https: https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28

function App() {
  const [almost, setAlmost] = useState<number>(0);
  const [almostList, setAlmostList] = useState<Map<string, string>>(new Map());
  const [categories, setCategories] = useState<string[]>([]);
  const [counter, setCounter] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [showCategory, setShowCategory] = useState<boolean>(false);
  const [guess, setGuess] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [incorrect, setIncorrect] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [lose, setLose] = useState<boolean>(false);
  const [number, setNumber] = useState<number[]>([]);
  const [restart, setRestart] = useState<boolean>(false);
  const [reveal, setReveal] = useState<boolean>(false);
  const [sent, setSent] = useState<string>("");
  const [similar, setSimilar] = useState<similarType>({})
  const [title, setListTitle] = useState<string[]>([]);
  const [wiki, setWiki] = useState<wikiFinalName>({ title: [], extract: [], url: "" });
  const [word, setWord] = useState<string[]>([]);

  const url = "https://ja.wikipedia.org/api/rest_v1/page/random/summary";
  const reg = /[,・。.、/＃！＄％^＆＊；： 『』「」＝＿’〜（）()[\]=]/;

  const getInitialWiki = async () => {
    let text = 0;
    let name: wikiType = { title: "", extract: "", url: "" };
    let info: any = {};
    let helps: string[] = [];
    try {
      while (text < 100 && !loading && helps.length < 3) {
        const { data } = await axios.get(url);
        helps = await getCategory(data.title);
        console.log('Data: ', data);
        text = data.extract.length;
        info = data;
      }
      console.log('Result: ', text, loading, helps.length);
      name = {
        title: info.title,
        extract: info.extract,
        url: info.content_urls.desktop.page
      }
      let segmenter = new TinySegmenter();
      let splitTitle = segmenter.segment(name.title);
      const newText = testText(segmenter.segment(name.extract));
      const nameRes: wikiFinalName = {
        title: regroupNum(splitTitle),
        extract: regroupNum(newText),
        url: name.url
      }

      const uniqueWord = new Set(nameRes.extract);
      const listTitle = [...splitTitle].filter((word) => !word.match(reg));
      const listUnique = [...uniqueWord].filter((word) => !word.match(reg) && isNaN(parseInt(word)));
      const simil = [...listUnique].filter((word) => !similar.hasOwnProperty(word));
      let mapAlmost = new Map();
      uniqueWord.forEach(w => { if (!w.match(reg)) mapAlmost.set(w, 'z') });
      const finalSimilar = { ...similar, ...(await createPred(simil)) };
      console.log("finalSimilar: ", finalSimilar);
      console.log("Res1: ", nameRes);
      console.log("Res2: ", number);
      setCategories(helps);
      setWord(listUnique);
      setListTitle(listTitle);
      setWiki(nameRes);
      setLoading(true);
      setAlmostList(mapAlmost);
      setSimilar(finalSimilar);
    } catch (err) {
      console.error(err);
      setLoading(false);
      throw new Error('Error');
    }
  }

  const createPred = async (list: string[]) => {
    let final: similarType = {};
    const listAxios = list.map((word) => axios.post("http://localhost:80/nearest", {}, { params: { word } }));
    const data = await axios.all(listAxios);
    const res = data.map((re) => re.data);
    res.forEach((re) => {
      final[Object.keys(re)[0]] = re[Object.keys(re)[0]];
    });
    return final;
  }

  const regroupNum = (value: string[]) => {
    let num = [];
    for (var i in value) {
      if (!isNaN(parseInt(value[i])) && parseInt(value[i])) {
        let j = parseInt(i) + 1;
        // console.log("NUM: ", value[i], " Next: ", value[j]);
        let count = 0;
        while (!isNaN(parseInt(value[j]))) {
          value[i] += value[j];
          j += 1;
          count += 1;
        }
        console.log(value[i])
        num.push(parseInt(value[i]));
        value.splice(parseInt(i) + 1, count);
      }
    }
    setNumber([...new Set(num)]);
    return value;
  }

  const getCategory = async (title: string) => {
    try {
      const params = new URLSearchParams([['title', title]]);
      const { data } = await axios.get("http://localhost:80/help", { params });
      return data;
    } catch (err) {
      console.error(err);
      throw new Error('Wikipedia category Error');
    }
  }

  const testText = (text: string[]) => {
    const shiNextCharac = ["れ", "し", "て", "た", "いる", "あっ"];
    for (let i in text) {
      if (shiNextCharac.includes(text[i])) {
        let ind = parseInt(i) + 1;
        while (shiNextCharac.includes(text[ind])) {
          text[i] += text[ind];
          text.splice(ind, 1);
        }
      }
    }
    return text;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(event.target.value);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleClick(event);
    } else handleChange(event);
  }

  const reload = () => {
    setRestart(true);
    setReveal(false);
    setCorrect(0);
    setCounter(0);
    setWiki({ title: [], extract: [], url: "" });
    setAlmost(0);
    setIncorrect(0);
    setHistory([]);
    setLose(false);
    setLoading(false);
    setShowCategory(false);
    setSent("");
    setWord([]);
  }

  const handleLose = (event: any) => {
    event.preventDefault();
    setReveal(true);
    setLose(true);
  }

  const handleHelp = (event: any) => {
    event.preventDefault();
    if (showCategory === false) setShowCategory(true);
    else {
      if (counter < categories.length - 1) setCounter(counter + 1);
      else setCounter(0);
    }
  }

  const handleClick = (event: any) => {
    event.preventDefault();
    if (guess.length !== 0) {
      console.log("ALmost: ", almostList);
      console.log("Title: ", wiki.title);
      let orange = 0;
      if (title.includes(guess)) title.splice(title.indexOf(guess), 1);
      if (word.includes(guess)) word.splice(word.indexOf(guess), 1);
      if (almostList.hasOwnProperty(guess)) almostList.delete(guess);

      if (!isNaN(parseInt(guess)) && number.length !== 0) {
        console.log("List Number: ", number);
        orange = checkNum(orange);
      } else {
        for(let checkWord of word) {
          console.log(checkWord);
          console.log(similar[checkWord]);
          
        }
        // Object.entries(similar).forEach((w) => {
        //   console.log(w);
        //   console.log(word);
        //   console.log(w[1].indexOf(guess));
        //   console.log(w[1].indexOf(almostList.get(w[0].toString())!));
        //   if (w[1] && w[1].includes(guess) && word.includes(w[0]) && w[1].indexOf(guess) < w[1].indexOf(almostList.get(w[0].toString())!)) {
        //     console.log("TEST1");
        //     almostList.set(w[0].toString(), guess);
        //     orange += numCharac(w[0]);
        //   }
        // })
      }

      const testW = numCharac(guess);
      if (testW === 0 && orange === 0) setIncorrect(1);
      else setIncorrect(0);
      if (!history.includes(guess)) history.unshift(guess);

      setHistory(history);
      setWord(word);
      setListTitle(title);
      setCorrect(testW);
      setAlmost(orange);
      setAlmostList(almostList);
      setGuess("");
      setSent(guess);
    }
  };

  const checkNum = (orange: number) => {
    const num = parseInt(guess);
    if (number.includes(num)) number.splice(number.indexOf(num), 1);
    if (number.length !== 0) {
      const almostTitle = wiki.title.filter((nu) => !isNaN(parseInt(nu)) && number.includes(parseInt(nu)));
      const almostText = wiki.extract.filter((nu) => !isNaN(parseInt(nu)) && number.includes(parseInt(nu)));
      orange = almostTitle.length + almostText.length;
      number.forEach((n: number) => {
        if (almostList.get(n.toString()) !== 'z' && Math.abs(n - parseInt(guess)) < Math.abs(n - parseInt(almostList.get(n.toString()) as string))) {
          almostList.set(n.toString(), guess);
        } else if (almostList.get(n.toString()) === 'z') almostList.set(n.toString(), guess);
      });
    }
    setNumber(number);
    return orange;
  }

  const numCharac = (data: string) => {
    let res = wiki.extract.filter((v) => (v === data)).length;
    res += wiki.title.filter((v) => (v === data)).length;
    return res;
  }

  useEffect(() => {
    if (!loading) {
      getInitialWiki();
    }
  }, [loading, restart]);

  return (
    <div >
      <header className="App-header">

        <h2>ペダン語</h2>
        {loading ?
          <div className="App-align">
            <History history={history} />
            <div >
              <div>
                <form className="App-search">
                  <input
                    className='App-input'
                    type="text"
                    id="guess"
                    name="guess"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    value={guess}
                  />
                  <div className='App-submit' onClick={handleClick}>
                    送る
                  </div>
                  <div className='App-submit' key='Lose' onClick={handleLose}>
                    失う
                  </div>
                  <div className='App-submit' key='Help' onClick={handleHelp}>
                    世話
                  </div>
                </form>
                <div className='App-test'>
                  {correct > 0 || almost > 0 ? <div className='App-res'> {Array({ length: correct }).map((e, i) => (
                    <div className='App-res' key={i}>🟩</div>
                  ))}{Array({ length: almost }).map((e, i) => (
                    <div className='App-res' key={i}>🟧</div>
                  ))}
                  </div> : incorrect ? <div>🟥</div> : null}
                </div>
                <div>
                  {showCategory ? <div>世話{counter + 1}: {categories[counter]}</div> : null}
                </div>
              </div>
              <Restart title={title} url={wiki.url} restart={reload} reveal={reveal} update={setReveal} lose={lose} loading={loading} />
              <div className='App-align'>
                <div className="App-wiki-content">
                  <Title wiki={wiki.title} title={title} reg={reg} listNumber={number} reveal={reveal} almostList={almostList} sent={sent} />
                  <Word wiki={wiki.extract} list={word} listNumber={number} reveal={reveal} almostList={almostList} sent={sent} />
                </div>
              </div>
            </div>
          </div> :
          <Loading />
        }
      </header>
    </div>
  );
}

export default App;
