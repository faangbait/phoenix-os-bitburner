import { FindValidMath } from "../find_valid_math_expr";
test('basic', () => {
    expect(FindValidMath.solve(['123', 6])).toStrictEqual(["1+2+3", "1*2*3"]);
    expect(FindValidMath.solve(['105', 5])).toStrictEqual(["1*0+5", "10-5"]);
});
test('tests', () => {
    expect(FindValidMath.answer(['232', 8])).toStrictEqual(["2+3*2", "2*3+2"]);
});
