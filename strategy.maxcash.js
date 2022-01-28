import Default from "./strategy.base";

export default class CashOut extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.hk.loop.js",
                ram: 1.7,
                ratio: 1,
            }
        ];
        
        this.stagger = 3;
    }

 /**
     * This is a priority queue. It filters targets by preference.
     * Because this strategy is intended to cash out servers prior to augment,
     * we prefer lower level servers. However, if there are not any servers
     * remaining under level 200, it will go on to the next condition.
     * 
     * Because it's a queue, and not a filter, a target will _always_ be returned,
     * even if it doesn't match any of these conditions. 
     * 
     * Note the format: (t => something-that-is-true-or-false)
     * 
     * @return {Function[]} 
     * @memberof CashOut
     */
    filter_targets() {
        let priorities = new Map();
        priorities.set(1, (t => t.level < 100));
        priorities.set(2, (t => t.level < 200));
        priorities.set(3, (t => t.level < 300));
        priorities.set(4, (t => t.level < 400));
        priorities.set(5, (t => t.level < 500));
        priorities.set(10, (t => t.security.level < 50));
        // default 15
        priorities.set(16, (t => t.money.available < 20000));
        return priorities;
    }
}