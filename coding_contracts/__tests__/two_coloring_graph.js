import { TwoColoringGraph } from "../two_coloring_graph";
test('basic', () => {
    expect(TwoColoringGraph.solve([3, [[0, 1], [0, 2], [1, 2]]])).toStrictEqual("[]");
    expect(TwoColoringGraph.solve([13, [[2, 12], [5, 6], [3, 11], [1, 10], [0, 10], [1, 12], [1, 3], [8, 12], [9, 10], [4, 12], [5, 12], [8, 9], [4, 7], [8, 11], [4, 8], [0, 3], [2, 7], [3, 9], [4, 10], [6, 9]]])).toStrictEqual("[]");
});
test('tests', () => {
    expect(TwoColoringGraph.answer([4, [[0, 2], [0, 3], [1, 2], [1, 3]]])).toStrictEqual([0, 0, 1, 1]);
});
