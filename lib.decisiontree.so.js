import * as utils from "./lib.utils.so";
import { Graph, GraphEdge, GraphVertex } from "./lib.structures.so";


import * as gs from "./lib.gamestates.so";
/*                                                 
This file is more of a thought-experiment in a future plan to maybe draft up
a genetic algorithm or some kind of machine learning model. It doesn't
do anything and probably never will.

Complete list of actions the player can take on a "turn"

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
const daedalus_rep_rate = 1;

/**
 * Vertex numbers are logged as "value" - ideally, a range between 0 and MAX_SAFE_INTEGER
 * Graph edges are "costs" in terms of logarithmic growth at any given part of the game. 
 * I calc money to grow at about 1.00027 without significant optimization. For now, I'm estimating
 * costs in seconds to achieve from the most recent milestone.
 *
 * @param {*} data
 */
const win = (data) => {
    // optimal faction order appears to be:
    // CSEC, Tian (rep), Nitesec,  BlackHand, Netburners, Bitrunners; 30 augs locked.
    // Tian only needs 6250 rep and ~half a billion
    let phoenix = new Graph(true);

    // primary win conditions
    let root = new GraphVertex(Number.MAX_SAFE_INTEGER); // defining the value of nodes MAX - expected distance in seconds
    phoenix.addVertex(root);
    let daedalus = new GraphVertex(Number.MAX_SAFE_INTEGER / time_to_win(daedalus_rep_rate));
    phoenix.addVertex(daedalus);
    new GraphEdge(daedalus, root, Number.MAX_SAFE_INTEGER-125000); // ~125k seconds to hit 2.5 mil rep, reset, and root

    let aug30req = new GraphVertex(Number.MAX_SAFE_INTEGER/augment_contribution_to_win_condition(number_of_augmentations)); // ~7.2k seconds to achieve other reqs
    phoenix.addVertex(aug30req);
    new GraphEdge(aug30req, daedalus, Number.MAX_SAFE_INTEGER-132200);
    
    // buying any aug contributes to aug30req
    let buyAug29 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug29, aug30req,3600);
    phoenix.addVertex(buyAug29);

    let buyAug28 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug28, buyAug29,3200);
    phoenix.addVertex(buyAug28);

    let buyAug27 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug27, buyAug28,2550);
    phoenix.addVertex(buyAug27);
    
    let buyAug26 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug26, buyAug27,2000);
    phoenix.addVertex(buyAug26);
    
    let buyAug25 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug25, buyAug26,1800);
    phoenix.addVertex(buyAug25);

    let buyAug24 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug24, buyAug25,1600);
    phoenix.addVertex(buyAug24);
    
    let buyAug23 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug23, buyAug24,1400);
    phoenix.addVertex(buyAug23);
    
    let buyAug22 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug22, buyAug23,1300);
    phoenix.addVertex(buyAug22);
    
    let buyAug21 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug21, buyAug22,1200);
    phoenix.addVertex(buyAug21);
    
    let buyAug20 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug20, buyAug21,1200);
    phoenix.addVertex(buyAug20);
    
    let buyAug19 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug19, buyAug20,1300);
    phoenix.addVertex(buyAug19);
    
    let buyAug18 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug18, buyAug19,1400);
    phoenix.addVertex(buyAug18);
    
    let buyAug17 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug17, buyAug18,1600);
    phoenix.addVertex(buyAug17);
    
    let buyAug16 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug16, buyAug17, 1800);
    phoenix.addVertex(buyAug16);
    
    let buyAug15 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug15, buyAug16,2000);
    phoenix.addVertex(buyAug15);
    
    let buyAug14 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug14, buyAug15,2400);
    phoenix.addVertex(buyAug14);
    
    let buyAug13 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug13, buyAug14,2550);
    phoenix.addVertex(buyAug13);
    
    let buyAug12 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug12, buyAug13,3200);
    phoenix.addVertex(buyAug12);
    
    let buyAug11 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug11, buyAug12,3800);
    phoenix.addVertex(buyAug11);
    
    let buyAug10 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug10, buyAug11,4700);
    phoenix.addVertex(buyAug10);
    
    let buyAug09 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug09, buyAug10,5900);
    phoenix.addVertex(buyAug09);
    
    let buyAug08 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug08, buyAug09,7000);
    phoenix.addVertex(buyAug08);
    
    let buyAug07 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug07, buyAug08,8500);
    phoenix.addVertex(buyAug07);
    
    let buyAug06 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug06, buyAug07,9000);
    phoenix.addVertex(buyAug06);
    
    let buyAug05 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug05, buyAug06, 9000);
    phoenix.addVertex(buyAug05);
    
    let buyAug04 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug04, buyAug05,9500);
    phoenix.addVertex(buyAug04);
    
    let buyAug03 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug03, buyAug04,10000);
    phoenix.addVertex(buyAug03);
    
    let buyAug02 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug02, buyAug03,11500);
    phoenix.addVertex(buyAug02);
    
    let buyAug01 = new GraphVertex(Number.MAX_SAFE_INTEGER/Math.min(30, number_of_augmentations * 0.5));
    new GraphEdge(buyAug01, buyAug02,24000);
    phoenix.addVertex(buyAug01);

    let ResetSkip5 = new GraphVertex();
    let ResetSkip10 = new GraphVertex();
    let ResetSkip16 = new GraphVertex();
    let ResetSkip21 = new GraphVertex();
    let ResetSkip29 = new GraphVertex();
    phoenix.addVertex(ResetSkip5);
    phoenix.addVertex(ResetSkip10);
    phoenix.addVertex(ResetSkip16);
    phoenix.addVertex(ResetSkip21);
    phoenix.addVertex(ResetSkip29);

    new GraphEdge(buyAug05, ResetSkip5, 9600);
    new GraphEdge(buyAug10, ResetSkip10, 4800);
    new GraphEdge(buyAug16, ResetSkip16, 2400);
    new GraphEdge(buyAug21, ResetSkip21, 1200);
    new GraphEdge(buyAug19, ResetSkip29, 600);

    new GraphEdge(ResetSkip5, buyAug06, 9600);
    new GraphEdge(ResetSkip10, buyAug11, 4800);
    new GraphEdge(ResetSkip16, buyAug17, 2400);
    new GraphEdge(ResetSkip21, buyAug22, 1200);
    new GraphEdge(ResetSkip29, aug30req,  600);

    // factions drive acquisition of aug30req vertex

    let JoinSector12 = new GraphVertex(400);
    new GraphEdge(JoinSector12, buyAug01, 2500); //  rep gain rate, basically
    new GraphEdge(JoinSector12, buyAug02, 3500);
    new GraphEdge(JoinSector12, buyAug03, 4500);
    new GraphEdge(JoinSector12, buyAug04, 5500);
    new GraphEdge(JoinSector12, buyAug05, 6500);
    new GraphEdge(buyAug05, Reset, 0);
    
    phoenix.addVertex(JoinSector12);

    let joinCyberSec = new GraphVertex(600);
    new GraphEdge(joinCyberSec, buyAug05, 3600);
    new GraphEdge(joinCyberSec, buyAug06, 4000);
    new GraphEdge(joinCyberSec, buyAug07, 4500);
    new GraphEdge(joinCyberSec, buyAug08, 5000);
    new GraphEdge(joinCyberSec, buyAug09, 5800);
    new GraphEdge(joinCyberSec, buyAug10, 6600);
    new GraphEdge(buyAug10, Reset, 0);
    phoenix.addVertex(joinCyberSec);

    let joinNiteSec = new GraphVertex(3600);
    new GraphEdge(joinNiteSec, buyAug11, 7000);
    new GraphEdge(joinNiteSec, buyAug12, 7500);
    new GraphEdge(joinNiteSec, buyAug13, 8200);
    new GraphEdge(joinNiteSec, buyAug14, 8600);
    new GraphEdge(joinNiteSec, buyAug15, 9000);
    new GraphEdge(joinNiteSec, buyAug16, 10000);
    new GraphEdge(buyAug16, Reset, 0);
    phoenix.addVertex(joinNiteSec);

    let joinBlackHand = new GraphVertex(3600);
    new GraphEdge(joinBlackHand, buyAug14, 5600);
    new GraphEdge(joinBlackHand, buyAug15, 5000);
    new GraphEdge(joinBlackHand, buyAug16, 10000);
    new GraphEdge(joinBlackHand, buyAug17, 12000);
    new GraphEdge(joinBlackHand, buyAug18, 24000);
    new GraphEdge(joinBlackHand, buyAug19, 8000);
    new GraphEdge(joinBlackHand, buyAug20, 8000);
    new GraphEdge(joinBlackHand, buyAug21, 8000);
    new GraphEdge(buyAug21, Reset, 0);
    phoenix.addVertex(joinBlackHand);

    let JoinBitrunners = new GraphVertex(3600);
    new GraphEdge(JoinBitrunners, buyAug19, 6000);
    new GraphEdge(JoinBitrunners, buyAug20, 8000);
    new GraphEdge(JoinBitrunners, buyAug21, 8000);
    new GraphEdge(JoinBitrunners, buyAug22, 8000);
    new GraphEdge(JoinBitrunners, buyAug23, 8000);
    new GraphEdge(JoinBitrunners, buyAug24, 8000);
    new GraphEdge(JoinBitrunners, buyAug25, 8000);
    new GraphEdge(JoinBitrunners, buyAug26, 8000);
    new GraphEdge(JoinBitrunners, buyAug27, 8000);
    new GraphEdge(JoinBitrunners, buyAug28, 8000);
    new GraphEdge(JoinBitrunners, buyAug29, 28000);
    new GraphEdge(buyAug29, Reset, 0);

    phoenix.addVertex(JoinBitrunners);

    let workforCorp = new GraphVertex(3600); // add corps
    new GraphEdge(workforCorp, buyAug14, 6000);
    new GraphEdge(workforCorp, buyAug17, 8000);
    new GraphEdge(workforCorp, buyAug20, 8000);
    new GraphEdge(workforCorp, buyAug23, 8000);
    new GraphEdge(workforCorp, buyAug26, 8000);
    new GraphEdge(workforCorp, buyAug28, 8000);
    phoenix.addVertex(workforCorp);


    let Hack = new GraphVertex();
    let purchaseServer = new GraphVertex(10000);
    new GraphEdge(purchaseServer, Hack, 0);
    new GraphEdge(upgradeRam, Hack, 21500);
    phoenix.addVertex(Hack);

    new GraphEdge(purchaseServer, Hack, 10000);
    phoenix.addVertex(purchaseServer);

    let StockMarket = new GraphVertex();
    new GraphEdge(StockMarket, buyAug20, 25600);
    new GraphEdge(StockMarket, buyAug21, 25600);
    new GraphEdge(StockMarket, buyAug22, 55400);
    new GraphEdge(StockMarket, buyAug23, 65400);
    new GraphEdge(StockMarket, buyAug24, 76400);
    new GraphEdge(StockMarket, buyAug25, 86400);
    new GraphEdge(StockMarket, buyAug26, 86400);
    new GraphEdge(StockMarket, buyAug27, 86400);
    new GraphEdge(StockMarket, buyAug28, 93000);
    new GraphEdge(StockMarket, buyAug29, 93000);
    phoenix.addVertex(StockMarket);
    
    
    let Start = new GraphVertex();
    new GraphEdge(Reset, Start, player.playtime.sinceLastAug/1000);
    phoenix.addVertex(Reset);
    phoenix.addVertex(Start);

    let attendUniversity = new GraphVertex(0);
    new GraphEdge(attendUniversity, Hack, 300);
    phoenix.addVertex(attendUniversity);
    
    new GraphEdge(Hack, JoinSector12, 60);
    new GraphEdge(Hack, joinCyberSec, 100);
    new GraphEdge(Hack, joinNiteSec, 300);
    new GraphEdge(Start, Hack, 0);
    new GraphEdge(Start, attendUniversity, 0);




        
};





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
