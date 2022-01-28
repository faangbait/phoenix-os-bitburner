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
     * Note the use of ratios; if they don't sum to 1, you'll get errors with invalid threadcounts.
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
                ratio: 45 / 64
            },
            {
                path: "bin.wk.loop.js",
                ram: 1.75,
                ratio: 14 / 64
            },
            {
                path: "bin.share.loop.js",
                ram: 4,
                ratio: 4/64
            },
        ];
        this.stagger = 8;
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

}