import { FindLPF } from "../find_lpf";
test('basic', () => {
    expect(FindLPF.solve(5)).toBe(5);
    expect(FindLPF.solve(95)).toBe(19);
    expect(FindLPF.solve(602)).toBe(43);
});
test('tests', () => {
    expect(FindLPF.answer(981)).toBe(109);
});
