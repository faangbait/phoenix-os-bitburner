import { TotalWaysToSum2 } from "../total_ways_to_sum_2";
test('basic', () => {
    expect(TotalWaysToSum2.solve([10, [2, 5, 8]])).toBe(3);
    expect(TotalWaysToSum2.solve([4, [1, 2, 3]])).toBe(4);
    expect(TotalWaysToSum2.solve([10, [2, 5, 3, 6]])).toBe(5);
});
test('tests', () => {
    expect(TotalWaysToSum2.answer([10, [2, 5, 3, 6]])).toBe(5);
});
