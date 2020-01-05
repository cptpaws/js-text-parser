const Interval = require('../types/Interval');
const matchAll = require('string.prototype.matchall');

/**
 * Returns the indices map for every match found
 * @param {String} string - the string to be parsed
 * @param {Array} processors - the processors to be applied
 * @return {Array}
 */
function getIndicesMap(string, processors) {
    return processors.map(p => {
        const matches = matchAll(string, new RegExp(p.rule, "gm"));
        let result = [];

        if (p.matchType === 'split') {
            result = result.concat(...handleSplitMatch(string, p, matches));
        } else {
            result = result.concat(...handleMatch(string, p, matches));
        }

        return result;
    }).flat(Infinity);
}

/**
 * Handles split type matches
 * @param {String} string - the string to be parsed
 * @param {Object} processor - the processor to be used
 * @param {Iterator} matches - the matches
 * @return {IterableIterator<*>}
 */
function* handleSplitMatch(string, processor, matches) {
    let lastEnd = 0, lastMatch = '';
    for (let match of matches) {
        let start = lastEnd;
        let end = match.index + match[0].length;
        let m = string.substring(start, end);

        lastEnd = end;
        lastMatch = match[0];

        yield {
            processor: processor.key,
            range: new Interval(start, end),
            match: m
        };
    }

    yield {
        processor: processor.key,
        range: new Interval(lastEnd + lastMatch.length, string.length),
        match: string.substring(lastEnd + lastMatch.length),
    };
}

/**
 * Handles regular matches
 * @param {String} string - the string to be parsed
 * @param {Object} processor - the processor to be used
 * @param {Iterator} matches - the matches
 * @return {IterableIterator<*>}
 */
function* handleMatch(string, processor, matches) {
    for (let match of matches) {
        let start = match.index;
        let end = match.index + match[0].length;

        yield {
            processor: processor.key,
            range: new Interval(start, end),
            match: string.substring(start, end)
        };
    }
}

module.exports = getIndicesMap;