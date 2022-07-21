import { UniquePathsGrid1 } from "../unique_paths_grid_1";
test('basic', () => {
    expect(UniquePathsGrid1.solve([3, 7])).toBe(28);
    expect(UniquePathsGrid1.solve([3, 2])).toBe(3);
});
test('tests', () => {
    expect(UniquePathsGrid1.answer([3, 2])).toBe(3);
});
