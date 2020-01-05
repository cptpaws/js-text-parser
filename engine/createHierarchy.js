const createIntersectionMap = require('./createIntersectionMap');

function createHierarchy(intersections, processors) {
    const uniqueRanges = getUniqueRanges(intersections);

    return uniqueRanges.map(range => {
        const entries = intersections.filter(i => i.range.same(range));
        return generateTree(entries, processors);
    });
}

function generateTree(entries, processors) {
    const sorted = entries.sort((a, b) => a.range.length - b.range.length);
    const maximumEntry = sorted[0];
    return computeUnderlings(maximumEntry, sorted, processors);
}

function computeUnderlings(entry, entries, processors) {
    if (!entry) {
        return null;
    }

    const tokens = createHierarchy(createIntersectionMap(entry.intersections), processors);

    let data = {};

    if (tokens.length !== 0) {
        data.tokens = computeTokens(entry.index, tokens);
    } else {
        data.text = entry.index.match;
    }

    return formatEntry(entry, processors, data);
}

function computeTokens(entry, tokens) {
    const finalTokens = [];
    const string = entry.match;

    let lastEnd = 0;
    tokens.forEach(token => {
        const offsetRange = {
            start: token.range.start - entry.range.start,
            end: token.range.end - entry.range.start
        };

        const t = string.substring(lastEnd, offsetRange.start);
        lastEnd = offsetRange.end;

        t && finalTokens.push(t);
        finalTokens.push(token);
    });

    const lastToken = string.substring(lastEnd);
    lastToken && finalTokens.push(string.substring(lastEnd));

    return finalTokens;
}

function formatEntry(entry, processors, data) {
    const processor = processors.find(p => p.key === entry.index.processor);

    return {
        processor: processor.key,
        range: entry.index.range.json(),
        payload: processor.payload,
        ...data,
    };
}

function getUniqueRanges(intersections) {
    const uniqueRanges = [];

    intersections.forEach(i => {
        const rangeExists = uniqueRanges.some(i.range.same);

        if (!rangeExists) {
            uniqueRanges.push(i.range);
        }
    });

    return uniqueRanges;
}

module.exports = createHierarchy;