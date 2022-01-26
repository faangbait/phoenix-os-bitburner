import Default from "./strategy.base";

export default class CashOut extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.hk.loop.js",
                ram: 1.7,
            }
        ];
        
        this.stagger = 3;
        this.memory_req = 1.7;
    }


    /**
     * This is a  filter function. If this filter returns true, the target
     * will be marked as complete and no one will attack it. Since this is a cash-out
     * strategy, we want to complete targets with very little money left.
     * 
     * Some targets are always disqualified - those you don't have root on and
     * those with $0 max cash. They aren't affected by this filter.
     *
     * @param {import('./phoenix-doc').ServerObject} t
     * @memberof CashOut
     */
    complete_when(t) {
        return (t.money.available < 50000 || t.security.level >= 95);
    }

    /**
     * This is a sieve function. It filters targets by preference.
     * Because this strategy is intended to cash out servers prior to augment,
     * we prefer lower level servers. However, if there are not any servers
     * remaining under level 200, it will go on to the next condition.
     * 
     * Because it's a sieve, and not a filter, a target will _always_ be returned,
     * even if it doesn't match any of these conditions. 
     * 
     * Note the format: (t => something-that-is-true-or-false)
     * 
     * @return {Function[]} 
     * @memberof CashOut
     */
    target_sieve() {
        return [
            (t => t.level < 100),
            (t => t.level < 200),
            (t => t.level < 300),
            (t => t.security.level < 50),
        ];
    }
}