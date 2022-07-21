import { ArrayJumping1, ArrayJumping2 } from "../array_jumping";
test('jump1', () => {
    expect(ArrayJumping1.answer([1, 1, 2, 3, 4])).toBe(1);
    expect(ArrayJumping1.answer([0, 0, 5])).toBe(0);
    expect(ArrayJumping1.answer([10])).toBe(1);
    expect(ArrayJumping1.answer([6, 0, 0, 0, 0, 0])).toBe(1);
    expect(ArrayJumping1.answer([1, 5, 1, 0, 1, 0, 4, 0, 0, 0, 1, 1])).toBe(1);
    expect(ArrayJumping1.answer([1, 1, 2, 0, 1, 2, 2, 0])).toBe(1);
});
test('jump2', () => {
    expect(ArrayJumping2.answer([0, 0, 5])).toBe(0);
    expect(ArrayJumping2.answer([6, 0, 0, 0, 0, 0])).toBe(1);
    expect(ArrayJumping2.answer([1, 5, 1, 0, 1, 0, 4, 0, 0, 0, 1, 1])).toBe(4);
    expect(ArrayJumping2.answer([1, 1, 2, 0, 1, 2, 2, 0])).toBe(5);
});
