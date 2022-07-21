import { MergeOverlapping } from "../merge_overlapping";
test('basic', () => {
    expect(MergeOverlapping.solve([[1, 3], [2, 6], [8, 10], [15, 18]])).toStrictEqual([[1, 6], [8, 10], [15, 18]]);
    expect(MergeOverlapping.solve([[1, 3], [8, 10], [2, 6], [10, 16]])).toStrictEqual([[1, 6], [8, 16]]);
});
test('tests', () => {
    expect(MergeOverlapping.answer([[1, 4], [4, 5]])).toStrictEqual([[1, 5]]);
});
