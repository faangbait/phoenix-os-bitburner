import { UniquePathsGrid2 } from "../unique_paths_grid_2";
test('basic', () => {
    expect(UniquePathsGrid2.solve([[0, 0, 0], [0, 1, 0], [0, 0, 0]])).toBe(2);
    expect(UniquePathsGrid2.solve([[0, 1], [0, 0]])).toBe(1);
});
test('tests', () => {
    expect(UniquePathsGrid2.answer([[0, 1], [0, 0]])).toBe(1);
});
