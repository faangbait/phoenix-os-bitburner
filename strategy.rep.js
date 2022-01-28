import Default from "./strategy.base";

export default class Represent extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.share.loop.js",
                ram: 4,
                ratio: 1 
            },
        ];
        this.stagger = 125;
        
    }

    
    disqualify_target(t) {
        return false;
    }


//     /**
//      * The Base prepare is very complicated, but this is all you really need.
//      * 
//      * @param {ServerObject} a single attacker
//      * @param {ServerObject[]} targets
//      * @return {string[]} 
//      * @memberof Represent
//      */
//     prepare_package(a, targets) {
//         if (Math.floor(a.ram.free / 4) > 0) {
//             return [
//                 JSON.stringify({
//                     file: "bin.share.loop.js",
//                     attacker: a.id,
//                     threads: Math.floor(a.ram.free / 4),
//                     args: [],
//                 })
//             ];
//         } else {
//             return [];
//         }
//     }
}