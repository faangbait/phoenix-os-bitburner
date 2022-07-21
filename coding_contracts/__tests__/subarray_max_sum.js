import { SubarrayMaxSum } from "../subarray_max_sum";
test('basic', () => {
    expect(SubarrayMaxSum.solve([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
    expect(SubarrayMaxSum.solve([1])).toBe(1);
});
test('tests', () => {
    expect(SubarrayMaxSum.answer([5, 4, -1, 7, 8])).toBe(23);
});
