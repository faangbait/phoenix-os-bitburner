import Default from "./strategy.base";

export default class Balanced extends Default {
    /**
     * Okay, now for a more complicated strategy.
     * 
     * We want to execute hk/gr/wk from attackers with sufficient RAM
     * to execute them at the right thread ratio (>= 64GB). We add the (new)
     * ratio property to this.files[] - Default doesn't support ratio,
     * but we're overloading the preparation stage anyway, so it's okay.
     * 
     * For servers under 64GB, we want them to share.
     * 
     * @memberof Balanced
     */
    constructor() {
        super();
        this.files = [{
                path: "bin.hk.loop.js",
                ram: 1.7,
                ratio: 1 / 64,
            },
            {
                path: "bin.gr.loop.js",
                ram: 1.75,
                ratio: 46 / 64
            },
            {
                path: "bin.wk.loop.js",
                ram: 1.75,
                ratio: 15 / 64
            },
            {
                path: "bin.share.loop.js",
                ram: 4,
                ratio: 1
            },
        ];
        this.stagger = 8;
        this.memory_req = 4;
    }

    /**
     * Disqualify attackers with less than 4GB RAM.
     * Technically, this.memory_req in the constructor would
     * already do this. But let's be doubly sure.
     *
     * @param {ServerObject} s
     * @return {boolean} true if disqualified
     * @memberof Balanced
     */
    disqualify_attacker(s) {
        return (s.ram.max < 4);
    }

    /**
     * Prefer targets with more than 75% of their money available.
     *
     * @memberof Balanced
     */
    // filter_targets() {
    //     return [
    //         (t => t.money.available / t.money.max > 0.75),
    //         (t => t.money.available / t.money.max > 0.25),
    //     ];
    // }
    sort_targets(targets) {
        return targets.sort ((a,b) => a.security.level- b.security_level);
    }

    /**
     *  This determines what happens during the attack. First, if
     *  the attacker has less than 64 GB of RAM, we launch share with
     *  max threads.
     * 
     *  If the attacker has more than 64 GB of RAM, we launch hk/gr/wk scripts
     *  in a ratio designated in the constructor.
     *
     * @param {ServerObject} a attacker
     * @param {ServerObject[]} targets
     * @return {string[]}  JSON attack array
     * @memberof Balanced
     */
    prepare_package(a, targets) {
        var bundles = [];
        if (a.ram.max < 64) {
            bundles.push(JSON.stringify({
                file: this.files[3].path,
                attacker: a.id,
                threads: a.threadCount(this.files[3].ram, true),
                args: []
            }));
        } else if (targets.length > 0) {
            for (let {
                    path,
                    ram,
                    ratio
                } of this.files) {
                if (Math.floor(a.threadCount(ram, true) * ratio) > 0) {
                    bundles.push(JSON.stringify({
                        file: path,
                        attacker: a.id,
                        threads: Math.floor(a.threadCount( this.memory_req / ratio )),
                        args: [targets[0].id]
                    }));
                }
            }
        }
        return bundles;
    }
}