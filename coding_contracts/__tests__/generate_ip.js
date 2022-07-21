import { GenerateIP } from "../generate_ip";
test('basic', () => {
    expect(GenerateIP.solve('25525511135').sort()).toStrictEqual(["255.255.11.135", "255.255.111.35"].sort());
    expect(GenerateIP.solve('1938718066').sort()).toStrictEqual(["193.87.180.66"].sort());
    expect(GenerateIP.solve('0000').sort()).toStrictEqual(["0.0.0.0"].sort());
});
test('tests', () => {
    expect(GenerateIP.answer('101023').sort()).toStrictEqual(["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"].sort());
});
