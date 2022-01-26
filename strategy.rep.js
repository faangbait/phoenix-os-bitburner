import Default from "./strategy.base";

export default class Represent extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.share.loop.js",
                ram: 4
            },
        ];
        
        this.stagger = 125;
        
    }

    /**
     * Share doesn't have a target, so we just return an empty filter.
     * On the off chance that we're trying to share before we actually hack
     * anything.
     *
     * @return {Function[]} 
     * @memberof Represent
     */
    filter_targets() {
        return [
            (t => t.level < 3000),
        ];
    }
    
    disqualify_target(t) {
        return false;
    }


    /**
     * The Base prepare is very complicated, but this is all you really need.
     * 
     * @param {ServerObject} a single attacker
     * @param {ServerObject[]} targets
     * @return {string[]} 
     * @memberof Represent
     */
    prepare_package(a, targets) {
        if (Math.floor(a.ram.free / 4) > 0) {
            return [
                JSON.stringify({
                    file: "bin.share.loop.js",
                    attacker: a.id,
                    threads: Math.floor(a.ram.free / 4),
                    args: [],
                })
            ];
        } else {
            return [];
        }
    }
}