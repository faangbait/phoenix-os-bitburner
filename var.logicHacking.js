import * as gs from "./lib.gamestates.so";

export function determineGameStage(servers, player) {
    var gameStage = gs.DefaultGameStage;

    /** @constant
     *
     * ordered by reverse preference. if a later stage applies, it will be selected.
     * e.g. if "early game" is designated by "not in cybersec" but if "end game"
     * is designated by "membership in daedalus", if you're in daedalus but not
     * in cybersec, you'll be placed in the endgame stage, because it's later.
     *
     * When multiple compareFns are specified for a stage, they are OR statements,
     * and if either is true, that stage will resolve as true.
     *
     */
    const stageCompare = [
        {
            cls: gs.gsNewGame,
            compareFns: [
                (servers.filter(s => s.id === "foodnstuff" & !s.admin).length > 0),
                (player.hacking.level < 100),
            ]
        },

        {
            cls: gs.gsEarlyGame,
            compareFns: [
                (player.faction.membership.includes("CyberSec")),
                // (player.ports > 2) // skips the "new game" rote setup if the player has advanced augments
            ]
        },
        {
            cls: gs.gsMidGame,
            compareFns: [
                (player.faction.membership.includes("BitRunners")),
                (servers.map(s => s.ram.max).reduce((a, b) => a + b, 0) > 10e7),
            ]
        },
        {
            cls: gs.gsLateGame,
            compareFns: [
                (player.faction.membership.includes("Daedalus")),
            ]
        },
        {
            cls: gs.gsEndGame,
            compareFns: [
                (servers.filter(s => s.id === String.fromCharCode(119, 48, 114, 49, 100, 95, 100, 52, 51, 109, 48, 110)).length > 0),
            ]
        },
        // { // moved to hwgw
        //     cls: gs.gsRepair,
        //     compareFns: [
        //         (servers.filter(s => s.level < 100 && s.money.available / s.money.max < 0.1).length > 7),
        //     ]
        // },
        {
            cls: gs.gsReadyForAug,
            compareFns: [
                (ns.readPort(1) == "READY FOR AUG"),
                (player.money > Math.pow(10, 12))
            ]
        }
    ];

    for (const stg of stageCompare) {
        for (const fn of stg.compareFns) {
            if (fn) {
                gameStage = stg.cls;
            }
        }
    }
    return gameStage;
}
