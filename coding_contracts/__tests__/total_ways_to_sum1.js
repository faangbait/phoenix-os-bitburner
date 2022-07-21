import { TotalWaysToSum } from "../total_ways_to_sum_1";
test('basic', () => {
    expect(TotalWaysToSum.solve(1)).toBe(0);
    expect(TotalWaysToSum.solve(2)).toBe(1);
    expect(TotalWaysToSum.solve(3)).toBe(2);
    expect(TotalWaysToSum.solve(4)).toBe(4);
    expect(TotalWaysToSum.solve(5)).toBe(6);
    expect(TotalWaysToSum.solve(6)).toBe(10);
    expect(TotalWaysToSum.solve(7)).toBe(14);
    expect(TotalWaysToSum.solve(8)).toBe(21);
    expect(TotalWaysToSum.solve(9)).toBe(29);
    expect(TotalWaysToSum.solve(19)).toBe(489);
});
test('tests', () => {
    expect(TotalWaysToSum.answer(24)).toBe(1574);
});
