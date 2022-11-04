import axios from "axios";
import express from 'express';
import w2v from 'word2vec';
import cors from 'cors';

const api = express();
// const server = https.createServer({key: key, cert: cert }, api);

(async function () {
    api.set("model", await test2());
})();
api.use(cors())

api.get('/', (req, res) => {
    res.send('Hello, world!');
});

api.get('/model', (req, res) => {
    const test = api.get('model');
    console.log(test);
    if (!test) res.send('NO');
    else res.send('YES');
})

api.get('/help', async (req, res) => {
    const { title } = req.query;
    const avoidString = [
        "LCCN", "WorldCat-VIAF", "VIAF", "ISBN", "のスタブ項目", "OSM", "Wikify", "記事"
    ]
    console.log("REQUEST: ", title);
    const url = encodeURI(`https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=categories&titles=${title}`);

    const { data } = await axios.get(url);
    const category = data.query.pages[Object.keys(data.query.pages)[0]].categories
        .map(category => category.title.replace('Category:', ''))
        .filter(category => {
            for(var i of avoidString) {
                if(category.includes(i)) return false;
            }
            return true;
        });
    console.log(category);
    res.send(category);
})

api.post('/nearest', (req, res) => {
    let resList = {};
    const { word } = req.query
    console.log(word);
    const test = api.get('model');
    const result = test.mostSimilar(word, 10);
    const t = result ? result.map((a) => a.word) : null;
    // console.log(t);
    resList[word] = t;
    res.send(resList);
})

function test2() {
    return new Promise(resolve => {
        w2v.loadModel('./server/word2vec_file/japanese.txt', function (error, model) {
            console.log(model);
            resolve(model);
        });
    });
}

api.listen(80, () => {
    console.log('API up and running!');
});