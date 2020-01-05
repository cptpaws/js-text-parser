const express = require('express');
const fs = require('fs');
const parse = require('./engine/parser');

const app = express();

const processors = [
    {
        key: 'blocks',
        rule: /^###$/g,
        matchType: 'split',
        payload: {
            component: 'block'
        }
    },
    {
        key: 'multiline',
        rule: /\r\n|\n|\r/g,
        matchType: 'split',
        payload: {
            component: 'multiline'
        }
    },
    {
        key: 'tag',
        rule: /@\[[\w\s-]+\]\([\w\s-]+\)/g,
        payload: {
            component: 'tag'
        }
    },
    {
        key: 'hashtag',
        rule: /#\[[\w\s-]+\]\([\w\s-]+\)/g,
        payload: {
            component: 'hashtag'
        }
    },
];

const string = fs.readFileSync('./some.txt');

app.get('/', (req, res) => {
    const result = parse(string.toString(), processors);

    res.send(`<pre>${JSON.stringify(result, undefined, 4)}</pre>`);
});

app.listen(3000);