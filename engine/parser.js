const matchAll = require('string.prototype.matchall');

let currentProcessor = 0;

function parse(value, processors) {
    return {
        key: processors[0].key,
        payload: processors[0].payload,
        tokens: process(value, processors)
    };
}

function process(value, processors, increment = true) {
    if (currentProcessor >= processors.length) {
        return value;
    } else if (typeof value === 'string') {
        let result = applyProcessor(value, processors[currentProcessor]);

        if (increment) {
            currentProcessor++;
        }

        if (typeof result !== 'string') {
            result = process(result, processors, currentProcessor === 0 ? true : increment);
        }

        return result;
    } else if (Array.isArray(value)) {
        for (let idx in value) {
            value[idx] = process(value[idx], processors, Number(idx) === value.length - 1);
        }

        return value;
    } else if (typeof value === 'object') {
        return process(value.tokens, processors, false);
    } else {
        return null;
    }
}

function applyProcessor(string, processor) {
    const indices = [];

    const matches = matchAll(string, processor.rule);

    for (let match of matches) {
        indices.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
        });
    }

    if (indices.length > 0) {
        return {
            key: processor.key,
            payload: processor.payload,
            metadata: {
                matches: indices
            },
            tokens: string.split(processor.rule)
        };
    } else {
        return string;
    }
}

module.exports = parse;