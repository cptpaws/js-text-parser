const getIndicesMap = require('./getIndicesMap');
const createIntersectionMap = require('./createIntersectionMap');
const createHierarchy = require('./createHierarchy');

function parse(string, processors) {
    const indicesMap = getIndicesMap(string, processors);
    const intersections = createIntersectionMap(indicesMap);
    const tree = createHierarchy(intersections, processors);

    return tree;
}

module.exports = parse;