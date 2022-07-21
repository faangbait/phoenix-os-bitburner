import { SanitizeParens } from "../sanitize_parens";
test('basic', () => {
    expect(SanitizeParens.solve('()())()')).toStrictEqual(["(())()", "()()()"]);
    expect(SanitizeParens.solve(')(')).toStrictEqual([""]);
});
test('tests', () => {
    expect(SanitizeParens.answer('(a)())()')).toStrictEqual(["(a())()", "(a)()()"]);
});
