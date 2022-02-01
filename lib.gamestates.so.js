/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

/**
 * Takes actions based on the current game state.
 * Game states are set via logic files.
 * 
 * @class GameState
 */
export class LogicState {
     constructor() {}
    /**
     * Creates an instance of GameState.
     * @param {ns} ns
     * @param {PlayerObject} player
     * @memberof GameState
     */
}


// /**
//  * After sufficient assets are attained, install augments and restart
//  *
//  * @export
//  * @class msReadyforAug
//  * @extends {DefaultMoneyStage}
//  */
// export class msReadyforAug extends DefaultMoneyStage {
//     /**
//      * Prepares the user to undertake a reaugmentation. Excluded due to requirement on SF4
//      *
//      * @static
//      * @param {*} ns
//      * @param {*} player
//      * @param {*} servers
//      * @return {*} 
//      * @memberof msReadyforAug
//      */
//     static async end_step(ns, player, servers) {
//         ns.toast("You're ready to install augments!", "info", 60000);
//         // kill all scripts
//         // ns.ps("home").filter(process => process.filename != "phoenix.js").forEach(process => ns.kill(process.pid));
//         if (ns.ps("home").every(process => process.filename != "sbin.market.js")) {
//             ns.exec("sbin.market.js", "home", 1, "SELLOFF");
//         }
        
//         await ns.sleep(6000);
//         let aug_list = [ // in order of preference
//             "Hacknet Node CPU Architecture Neural-Upload",
//             "Hacknet Node Cache Architecture Neural-Upload",
//             "Hacknet Node Core Direct-Neural Interface",
//             "Hacknet Node Kernel Direct-Neural Interface",
//             "Hacknet Node NIC Architecture Neural-Upload",
//             "Cranial Signal Processors - Gen I",
//             "Cranial Signal Processors - Gen II",
//             "Cranial Signal Processors - Gen III",
//             "Cranial Signal Processors - Gen IV",
//             "Embedded Netburner Module",
//             "Artificial Synaptic Potentiation",
//             "Neurotrainer II",
//             "Neurotrainer I",
//             "Bitwire",
//             "Synaptic Enhancement Implant",
//             "Neuralstimulator",
//             "Enhanced Myelin Sheathing",
//             "CRTX42-AA Gene Modification",
//             "DataJack",
//             "The Black Hand",
//             "CashRoot Starter Kit",
//             "Embedded Netburner Module Core V2 Upgrade",
//             "Bitrunners Neurolink",
//             "Artificial Bio-neural Network Implant",
//             "Cranial Signal Processors - Gen V",
//             "Neural Accelerator"
//         ];
//         // buy all augs for faction
//         // max upgrade home ram
//         // upgrade home cores at most once
//         // max neuroflux
//         // reset via a function
//         return {player, servers};
//     }
// }


