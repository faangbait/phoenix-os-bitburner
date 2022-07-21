import { StockTrader1, StockTrader2, StockTrader3, StockTrader4 } from "../stock_trader_universal";
test('st1', () => {
    expect(StockTrader1.answer([7, 1, 5, 3, 6, 4])).toBe(5);
    expect(StockTrader1.answer([7, 6, 4, 3, 1])).toBe(0);
});
test('st2', () => {
    expect(StockTrader2.answer([7, 1, 5, 3, 6, 4])).toBe(7);
    expect(StockTrader2.answer([1, 2, 3, 4, 5])).toBe(4);
    expect(StockTrader2.answer([7, 6, 4, 3, 1])).toBe(0);
});
test('st3', () => {
    expect(StockTrader3.answer([3, 3, 5, 0, 0, 3, 1, 4])).toBe(6);
    expect(StockTrader3.answer([1, 2, 3, 4, 5])).toBe(4);
    expect(StockTrader3.answer([7, 6, 4, 3, 1])).toBe(0);
});
test('st4', () => {
    expect(StockTrader4.answer([2, [2, 4, 1]])).toBe(2);
    expect(StockTrader4.answer([2, [3, 2, 6, 5, 0, 3]])).toBe(7);
    expect(StockTrader4.answer([3, [10, 25, 38, 40, 45, 5, 58]])).toBe(88);
});
