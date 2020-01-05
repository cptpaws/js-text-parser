const Interval = require('../types/Interval');

function createIntersectionMap(indicesMap) {
    const result = [];

    for (let index of indicesMap) {
        let indexIntersections = {
            index,
            range: index.range,
            intersections: []
        };

        for (let otherIndex of indicesMap) {
            if (index.processor === otherIndex.processor) {
                continue;
            }

            if (index.range.includes(otherIndex.range)) {
                indexIntersections.intersections.push(otherIndex);

                if (index.range.isIncluded(otherIndex.range)) {
                    indexIntersections.range = new Interval(otherIndex.range.start, otherIndex.range.end);
                }
            }
        }

        result.push(indexIntersections);
    }

    return result;
}

module.exports = createIntersectionMap;