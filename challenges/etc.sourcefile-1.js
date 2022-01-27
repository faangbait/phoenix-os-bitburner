/** @param {import(".").NS } ns */


function karma(ns) {  //done
    return ns.heart.break();
}

function undocumented(ns) { // done
    return ns.exploit();
}

var thisWin = globalThis;
function bp(ns) {
    ns.bypass(thisWin["document"]);
}

function alter(ns) {
    // Debug -> Sources -> main.bundle.js -> set a breakpoint on alterReality
    // when that breakpoint hits, the value of x will be stored in memory
    // modify the value in memory
    ns.alterReality();
}

function unclickable(ns) {
}

function unavailable(ns) {
    // edit the game source main.bundle.js
    
    // OLD:
    // UNACHIEVABLE:{...C.UNACHIEVABLE,Icon:"SF-1",Secret:!0,Condition:()=>!0}
    
    // NEW:
    // UNACHIEVABLE:{...C.UNACHIEVABLE,Icon:"SF-1",Secret:!0,Condition:()=>!1}

}

async function proto(ns) {
    Number.prototype.toExponential = (fractionDigits) => "foobar";
    ns.tprint("Number prototype altered; awaiting 15 minute timer");
}

export async function main(ns){
    // Bypass: "by circumventing the ram cost of document.",
    bp(ns);

    // EditSaveFile: "by editing your save file.",

    // TimeCompression: "by compressing time.",

    // Unclickable: "by clicking the unclickable.",
    unclickable(ns);

    // UndocumentedFunctionCall: "by looking beyond the documentation.",
    undocumented(ns);

    // RealityAlteration: "by altering reality to suit your whims.",
    alter(ns);

    // N00dles: "by harnessing the power of the n00dles.",
    // just click on the noodle bar

    // YoureNotMeantToAccessThis: "by accessing the dev menu.",

    // UNACHIEVABLE
    unavailable(ns);
    // PrototypeTampering: "by tampering with Numbers prototype.",
    await proto(ns);
    await ns.asleep(1000*60*15);
}