/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */
import Default from "./strategy.base";

export default class hwgwww extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.hk.futureloop.js",
                ram: 1.75,
                ratio: 0
            },
            {
                path: "bin.gr.futureloop.js",
                ram: 1.8,
                ratio: 0
            },
            {
                path: "bin.wk.futureloop.js",
                ram: 1.8,
                ratio: 0
            }
        ];
        this.stagger = 1;
    }

    disqualify_attacker(s) {
        return (s.ram.max < 8 || s.ram.free < 6);
    }

    prepare_bulk(attackers, player){

        let bundles = [];
        let pre_bundles = [];
        let unpromised_ram = new Map();
        let target = this.priorityQueue.poll();
        let spacing = attackers.length*2;

        attackers.forEach(a => unpromised_ram.set(a.id, a.ram.free));
        attackers.sort((a, b) => a.ram.free - b.ram.free); // sort low to high ram to fill weaken orders first

        while (target) {
            pre_bundles.push(calculate_hwgw_batch(target, player));
            target = this.priorityQueue.poll();
        }

        pre_bundles.sort((a, b) => b.growThreads - a.growThreads); // biggest targets first

        for (let bundle of pre_bundles) {
            let batch_time = 0;
            batch_time++;
            let target = bundle.target;
            let sumThreads = bundle.hackThreads + bundle.growThreads + bundle.weakThreads1 + bundle.weakThreads2;
            let suggested_bundles = [];
            for (let a of attackers) {
                let a_threads = {
                    w1: 0,
                    w2: 0,
                    g: 0,
                    h: 0
                };
                while (bundle.weakThreads1 > 0 && unpromised_ram.get(a.id) > 9) { // 5 weakens
                    bundle.weakThreads1 -= 5;
                    if (bundle.weakThreads1 < 0) {
                        a_threads.w1 += 5 - Math.abs(bundle.weakThreads1);
                        unpromised_ram.set(a.id, unpromised_ram.get(a.id) - (5 - Math.abs(bundle.weakThreads1) * 1.8));
                        sumThreads -= 5 - Math.abs(bundle.weakThreads1);
                        bundle.weakThreads1 = 0;
                    } else {
                        a_threads.w1 += 5;
                        unpromised_ram.set(a.id, unpromised_ram.get(a.id) - 9);
                        sumThreads -= 5;
                    }
                }

                while (bundle.weakThreads2 > 0 && unpromised_ram.get(a.id) > 9) { // 5 weakens
                    bundle.weakThreads2 -= 5;
                    if (bundle.weakThreads2 < 0) {
                        a_threads.w2 += 5 - Math.abs(bundle.weakThreads2);
                        unpromised_ram.set(a.id, unpromised_ram.get(a.id) - (5 - Math.abs(bundle.weakThreads2) * 1.8));
                        sumThreads -= 5 - Math.abs(bundle.weakThreads2);
                        bundle.weakThreads2 = 0;
                    } else {
                        a_threads.w2 += 5;
                        unpromised_ram.set(a.id, unpromised_ram.get(a.id) - 9);
                        sumThreads -= 5;
                    }
                }

                if (a_threads.w1 > 0) {
                    suggested_bundles.push({
                        file: "bin.wk.hwgw.js",
                        attacker: a.id,
                        threads: a_threads.w1,
                        args: [target.id, bundle.nextlaunchdate + spacing + (batch_time * 100)]
                    });
                }

                if (a_threads.w2 > 0) {
                    suggested_bundles.push({
                        file: "bin.wk.hwgw.js",
                        attacker: a.id,
                        threads: a_threads.w2,
                        args: [target.id, bundle.nextlaunchdate + (spacing * 3) + (batch_time * 100)]
                    });
                }


                if (unpromised_ram.get(a.id) > bundle.growThreads * 1.8) {
                    a_threads.g = bundle.growThreads;
                    sumThreads -= bundle.growThreads;
                    unpromised_ram.set(a.id, unpromised_ram.get(a.id) - (bundle.growThreads * 1.8));
                    suggested_bundles.push({
                        file: "bin.gr.hwgw.js",
                        attacker: a.id,
                        threads: a_threads.g,
                        args: [target.id, bundle.nextlaunchdate + (spacing * 2) + (batch_time * 100)]
                    });
                    bundle.growThreads = 0;
                }

                if (unpromised_ram.get(a.id) > bundle.hackThreads * 1.75) {
                    a_threads.h = bundle.hackThreads;
                    sumThreads -= bundle.hackThreads;
                    unpromised_ram.set(a.id, unpromised_ram.get(a.id) - (bundle.hackThreads * 1.75));
                    suggested_bundles.push({
                        file: "bin.hk.hwgw.js",
                        attacker: a.id,
                        threads: a_threads.h,
                        args: [target.id, bundle.nextlaunchdate]
                    });
                    bundle.hackThreads = 0;

                }
            }

            suggested_bundles = suggested_bundles.filter(b => b.threads >= 1);
            let sanity_check = (sumThreads == 0) &&
                (suggested_bundles.every(b => typeof b.attacker === "string")) &&
                (suggested_bundles.every(b => typeof b.args[0] === "string")) &&
                (suggested_bundles.every(b => b.args.length === 2));



            if (sanity_check) {

                // attackers.forEach(a => console.log("On the " + index + " iteration, " + a.id + " has " + unpromised_ram.get(a.id) + " ram remaining"));
                bundles.push(...suggested_bundles.map(b => JSON.stringify(b)));

            }
        }
        return bundles;
    }

    disqualify_target(t) {
        return (false);
    }

    filter_targets() {
        let priorities = new Map();
        priorities.set(0, (t => Math.ceil(t.money.available) == Math.ceil(t.money.max) && t.security.level == t.security.min));
        priorities.set(10, (t => t.hackTime < 60000));
        priorities.set(19, (t => t.money.available < t.money.max && t.security.level > t.security.min));
        priorities.set(18, (t => (t.id == "n00dles")));
        return priorities;
    }
    
    __package(bootstrapped, player) {
        return bootstrapped.map(a => this.prepare_bulk(bootstrapped, player));
    }

}

function calculate_hwgw_batch(target, player) {

    var percentage_hacked = 0.40;
    var hackThreads;
    var growThreads;
    var weakThreads1;
    var weakThreads2;
    var sec1;
    var sec2;

    var hackTime = globalThis.ns.getHackTime(target.id);
    var growTime = hackTime * 3.2;
    var weakenTime = hackTime * 4;

    hackThreads = globalThis.ns.hackAnalyzeThreads(target.id, (target.money.max * percentage_hacked));
    growThreads = globalThis.ns.growthAnalyze(target.id, 1 / percentage_hacked);

    sec1 = hackThreads * 0.002;
    sec2 = growThreads * 0.004;
    weakThreads1 = sec1 / 0.05;
    weakThreads2 = sec2 / 0.05;

    if (target.money.max > target.money.available || target.security.level > target.security.min) {
        hackThreads = 0;
        growThreads = numCycleForGrowthByHackAmt(target, target.money.max/target.money.available, target.money.max, player);
        weakThreads1 = (0.002 + target.security.level - target.security.min) / 0.05;
        weakThreads2 = growThreads * 0.004;
    }

    let nextlaunchdate = new Date().valueOf() + Math.max(2000, weakenTime * 1.1);

    hackThreads  = Math.floor(hackThreads);
    growThreads  = Math.ceil(growThreads);
    weakThreads1 = Math.ceil(weakThreads1);
    weakThreads2 = Math.ceil(weakThreads2);

    return {
        hackTime,
        growTime,
        weakenTime,
        hackThreads,
        growThreads,
        weakThreads1,
        weakThreads2,
        nextlaunchdate,
        target
    };
}

/**
 *
 *
 * @export
 * @param {ServerObject} server
 * @param {number} targetMoney
 * @param {number} startMoney
 * @param {PlayerObject} p
 * @param {number} [cores=1]
 * @return {*} 
 */
export function numCycleForGrowthCorrected(server, targetMoney, startMoney, p, cores = 1) {
    if (startMoney < 0) { startMoney = 0; } // servers "can't" have less than 0 dollars on them
    if (targetMoney > server.money.max) { targetMoney = server.money.max; } // can't grow a server to more than its moneyMax
    if (targetMoney <= startMoney) { return 0; } // no growth --> no threads

    // exponential base adjusted by security
    const adjGrowthRate = (1 + (1.03 - 1) / server.security.level);
    const exponentialBase = Math.min(adjGrowthRate, 1.0035); // cap growth rate

    // total of all grow thread multipliers
    const serverGrowthPercentage = server.money.growth / 100.0;
    const coreMultiplier = 1 + ((cores - 1) / 16);
    const threadMultiplier = serverGrowthPercentage * globalThis.ns.getPlayer().hacking_grow_mult * coreMultiplier // * BitNodeMultipliers.ServerGrowthRate;

    /* To understand what is done below we need to do some math. I hope the explanation is clear enough.
     * First of, the names will be shortened for ease of manipulation:
     * n:= targetMoney (n for new), o:= startMoney (o for old), b:= exponentialBase, t:= threadMultiplier, c:= cycles/threads
     * c is what we are trying to compute.
     *
     * After growing, the money on a server is n = (o + c) * b^(c*t)
     * c appears in an exponent and outside it, this is usually solved using the productLog/lambert's W special function
     * this function will be noted W in the following
     * The idea behind lambert's W function is W(x)*exp(W(x)) = x, or in other words, solving for y, y*exp(y) = x, as a function of x
     * This function is provided in some advanced math library but we will compute it ourself here.
     *
     * Let's get back to solving the equation. It cannot be rewrote using W immediately because the base of the exponentiation is b
     * b^(c*t) = exp(ln(b)*c*t) (this is how a^b is defined on reals, it matches the definition on integers)
     * so n = (o + c) * exp(ln(b)*c*t) , W still cannot be used directly. We want to eliminate the other terms in 'o + c' and 'ln(b)*c*t'.
     *
     * A change of variable will do. The idea is to add an equation introducing a new variable (w here) in the form c = f(w) (for some f)
     * With this equation we will eliminate all references to c, then solve for w and plug the result in the new equation to get c.
     * The change of variable performed here should get rid of the unwanted terms mentionned above, c = w/(ln(b)*t) - o should help.
     * This change of variable is allowed because whatever the value of c is, there is a value of w such that this equation holds:
     * w = (c + o)*ln(b)*t  (see how we used the terms we wanted to eliminate in order to build this variable change)
     *
     * We get n = (o + w/(ln(b)*t) - o) * exp(ln(b)*(w/(ln(b)*t) - o)*t) [ = w/(ln(b)*t) * exp(w - ln(b)*o*t) ]
     * The change of variable exposed exp(w - o*ln(b)*t), we can rewrite that with exp(a - b) = exp(a)/exp(b) to isolate 'w*exp(w)'
     * n = w/(ln(b)*t) * exp(w)/exp(ln(b)*o*t) [ = w*exp(w) / (ln(b) * t * b^(o*t)) ]
     * Almost there, we just need to cancel the denominator on the right side of the equation:
     * n * ln(b) * t * b^(o*t) = w*exp(w), Thus w = W(n * ln(b) * t * b^(o*t))
     * Finally we invert the variable change: c = W(n * ln(b) * t * b^(o*t))/(ln(b)*t) - o
     *
     * There is still an issue left: b^(o*t) doesn't fit inside a double precision float
     * because the typical amount of money on servers is arround 10^6~10^9
     * We need to get an approximation of W without computing the power when o is huge
     * Thankfully an approximation giving ~30% error uses log immediately so we will use
     * W(n * ln(b) * t * b^(o*t)) ~= log(n * ln(b) * t * b^(o*t)) = log(n * ln(b) * t) + log(exp(ln(b) * o * t))
     * = log(n * ln(b) * t) + ln(b) * o * t
     * (thanks to Drak for the grow formula, f4113nb34st and Wolfram Alpha for the rewrite, dwRchyngqxs for the explanation)
     */
    const x = threadMultiplier * Math.log(exponentialBase);
    const y = startMoney * x + Math.log(targetMoney * x);
    /* Code for the approximation of lambert's W function is adapted from
     * https://git.savannah.gnu.org/cgit/gsl.git/tree/specfunc/lambert.c
     * using the articles [1] https://doi.org/10.1007/BF02124750 (algorithm above)
     * and [2] https://doi.org/10.1145/361952.361970 (initial approximation when x < 2.5)
     */
    let w;
    if (y < Math.log(2.5)) {
        /* exp(y) can be safely computed without overflow.
         * The relative error on the result is better when exp(y) < 2.5
         * using Padé rational fraction approximation [2](5)
         */
        const ey = Math.exp(y);
        w = (ey + 4/3 * ey*ey) / (1 + 7/3 * ey + 5/6 * ey*ey);
    } else {
        /* obtain initial approximation from rough asymptotic [1](4.18)
         * w = y [- log y when 0 <= y]
         */
        w = y;
        if (y > 0) w -= Math.log(y);
    }
    let c = w/x - startMoney;

    /* Iterative refinement, the goal is to correct c until |(o + c) * b^(c*t) - n| < 1
     * or the correction on the approximation is less than 1
     * The Newton-Raphson method will be used, this method is a classic to find roots of functions
     * (given f, find c such that f(c) = 0).
     *
     * The idea of this method is to take the horizontal position at which the horizontal axis
     * intersects with of the tangent of the function's curve as the next approximation.
     * It is equivalent to treating the curve as a line (it is called a first order approximation)
     * If the current approximation is c then the new approximated value is c - f(c)/f'(c)
     * (where f' is the derivative of f).
     *
     * In our case f(c) = (o + c) * b^(c*t) - n, f'(c) = d((o + c) * b^(c*t) - n)/dc
     * = (ln(b)*t * (c + o) + 1) * b^(c*t)
     * And the update step is c[new] = c[old] - ((o + c) * b^(c*t) - n)/((ln(b)*t * (o + c) + 1) * b^(c*t))
     *
     * The main question to ask when using this method is "does it converges?"
     * (are the approximations getting better?), if it does then it does quickly.
     * DOES IT CONVERGES? In the present case it does. The reason why doesn't help explaining the algorithm.
     * If you are intrested then check out the wikipedia page.
     */
    const bt = exponentialBase**threadMultiplier;
    let diff = Infinity;
    // Two sided error because we do not want to get stuck if the error stays on the wrong side
    while (Math.abs(diff) >= 1) {
        // c should be above 0 so Halley's method can't be used, we have to stick to Newton-Raphson
        const bct = bt**c;
        const opc = startMoney + c;
        diff = opc * bct - targetMoney;
        c -= diff / (opc * x + 1.0) / bct;
    }
    /* c is now within +/- 1 of the exact result.
     * We want the ceiling of the exact result, so the floor if the approximation is above,
     * the ceiling if the approximation is in the same unit as the exact result,
     * and the ceiling + 1 if the approximation is below.
     */
    const fca = Math.floor(c);
    if (targetMoney <= (startMoney + fca)*Math.pow(exponentialBase, fca*threadMultiplier)) {
        return fca;
    }
    const cca = Math.ceil(c);
    if (targetMoney <= (startMoney + cca)*Math.pow(exponentialBase, cca*threadMultiplier)) {
        return cca;
    }
    return cca + 1;
}

/**
 * This function calculates the number of threads needed to grow a server based on a pre-hack money and hackAmt
 * (ie, if you're hacking a server with $1e6 moneyAvail for 60%, this function will tell you how many threads to regrow it
 * PROBABLY the best replacement for the current ns.growthAnalyze
 * @param server - Server being grown
 * @param hackProp - the proportion of money hacked (total, not per thread, like 0.60 for hacking 60% of available money)
 * @param prehackMoney - how much money the server had before being hacked (like 200000 for hacking a server that had $200000 on it at time of hacking)
 * @param p - Reference to Player object
 * @returns Number of "growth cycles" needed to reverse the described hack
 */
export function numCycleForGrowthByHackAmt(server, hackProp, prehackMoney, p, cores = 1) {
    if (prehackMoney > server.money.max) { prehackMoney = server.money.max; }
    const posthackAmt = Math.floor(prehackMoney * Math.min(1, Math.max(0, (1 - hackProp))));
    return numCycleForGrowthCorrected(server, prehackMoney, posthackAmt, p, cores);
}