const parse = require('./engine/parser');

const processors = [
    {
        key: 'multiline',
        rule: /\n|\r|\r\n/g,
        payload: {
            component: 'multiline'
        }
    },
    {
        key: 'tag',
        rule: /@\[[\w\s-]+\]\([\w\s-]+\)$/g,
        payload: {
            component: 'tag'
        }
    }
];

const result = parse(
    `Some things are better
    to remain forgotten
    isnt that right @[Cosmin Stoica](cosmin-user-id)`
    , processors);

console.log(result);