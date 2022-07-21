/**
 * @typedef {import(".").NS} ns
 *
 * @argument {string} target
 * @argument {boolean} runonce defaults false
 *
 * @export
 * @param {ns} ns
 */
import { check_control_sequence } from "lib/Database";
import { ServerCache } from "modules/servers/ServerCache";
export const main = async (ns) => {
    ns.disableLog("ALL");
    ns.enableLog("hack");
    ns.enableLog("grow");
    ns.enableLog("weaken");
    let args = ns.args;
    let target = args[0];
    let runonce = args[1];
    if (typeof target !== "string") {
        return;
    }
    if (typeof runonce !== "boolean") {
        runonce = false;
    }
    do {
        await check_control_sequence(ns);
        let t = ServerCache.read(ns, target);
        if (!t) {
            await ns.sleep(100);
        }
        else {
            let sec = t.security.level;
            let minsec = t.security.min;
            let money = t.money.available;
            let maxMoney = t.money.max;
            if (sec > minsec + 5) {
                await ns.weaken(t.id);
            }
            else if (money < 0.75 * maxMoney) {
                await ns.grow(t.id);
            }
            else {
                await ns.hack(t.id);
            }
        }
    } while (!runonce);
};
