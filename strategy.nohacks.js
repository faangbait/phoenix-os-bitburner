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
                ram: 1.75,
                ratio: 0.8
            },
            {
                path: "bin.wk.loop.js",
                ram: 1.75,
                ratio: 0.1
            },
            {
                path: "bin.share.loop.js",
                ram: 4,
                ratio: 0.1
            }
        ];
        this.stagger = 1;
    }

    /**
     * Prefer targets that need grow/weaken.
     *
     * @param {ServerObject} t
     * @return {boolean} 
     * @memberof GoodGuy
     */
     filter_targets() {
        let priorities = new Map();
        priorities.set(0, (t => (t.money.available / t.money.max) < 1));
        priorities.set(5, (t => t.security.level > t.security.min));
        return priorities;
    }
}