import * as utils from "./lib.utils.so";
import * as gs from "./lib.gamestates.so";

/* Complete list of actions the player can take on a "turn"

Start a hack
Stop a hack
Retarget a hack
Work somewhere
Donate to a faction
Install augmentations
Buy hacknet servers
Buy programs
Buy and sell stocks


*/

/* Fitness function: does this increase or decrease the time it takes to take the red pill */
// Requirements to take the red pill: 2.5 M rep with Daedalus
// Requirements to earn rep with Daedalus: 30 augs, 100b cash, 2500 hack

const daedalus_favor = 130;
const daedalus_favor_mult  = 1 + (130 / 100);
const intelligence_bonus = 1;
const number_of_augmentations = 32;

const time_to_win = (daedalus_rep_rate, donations=0) => {
    let raw_time = 2500000 / daedalus_rep_rate;

};

const donation_rep_gain = (donation_amount) => {
    
    // let reputation_mult = (100 + daedalus_favor) / 100;
    let reputation_mult = globalThis.ns.getPlayer().faction_rep_mult;
    return (donation_amount * reputation_mult) / Math.pow(10,6);
};

// theoretically, "p" can be any player-like object, suggesting that we might factory invented players to see
// if they have better rep rates.
const daedalus_rep_rate = (p) => {

    if (p.currentWorkFactionName === "Daedalus") {
        return (
            ((p.hacking_skill + p.intelligence / 3) / 975) *
            p.faction_rep_mult *
            intelligence_bonus *
            daedalus_favor_mult
          );
    } else {
        return augment_contribution_to_win_condition +
        networth_contribution_to_win_condition +
        skill_contribution_to_win_condition;
    }
};

// 30 augs will contribute 15 rep per sec to daedalus
const augment_contribution_to_win_condition = (number_of_augmentations) => {
    return Math.min(30, number_of_augmentations * 0.5);
};

// since networth is primarily useful for purchasing augs, and the cost of augs
// doubles, our networth is considered logarithmically. Since the purchase price
// in any given aug run starts at a billion dollars, we're considering that the "1" value
// e.g. your first 10 billion contributes 1 rep per sec to daedalus.
const networth_contribution_to_win_condition = (net_worth) => {
    return (Math.log(net_worth) / Math.log(2) / Math.pow(10,9));
};

// much like networth, the value of a hacking skill above 512 significantly
// reduces in value. however, i'm comfortable calling it log(6,x), because this
// will appropriately cause the algorithm to seek levels quickly at the start of the game
const skill_contribution_to_win_condition = (hacking_skill_level) => {
    return (Math.log(hacking_skill_level) / Math.log(6));
};
