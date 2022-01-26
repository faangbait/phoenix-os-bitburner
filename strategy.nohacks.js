/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import Default from "./strategy.base";

export default class GoodGuy extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.gr.loop.js",
                ram: 1.75
            },
            {
                path: "bin.wk.loop.js",
                ram: 1.75
            },
            {
                path: "bin.share.loop.js",
                ram: 4
            }
        ];
        this.stagger = 1;
        this.memory_req = 7.5;
    }

    /**
     * Disqualify targets that need to be prepped.
     *
     * @param {ServerObject} t
     * @return {boolean} 
     * @memberof GoodGuy
     */
    complete_when(t) {
        return (t.money.available / t.money.max == 1 && t.security.min == t.security.level);
    }
    
}