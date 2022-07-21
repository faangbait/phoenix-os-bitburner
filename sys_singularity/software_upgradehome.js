export const main = async (ns) => {
    let args = ns.args;
    let type = args[0];
    if (type !== "ram" && type !== "core") {
        return;
    }
    if (type === "ram") {
        ns.singularity.upgradeHomeRam();
    }
    if (type === "core") {
        ns.singularity.upgradeHomeCores();
    }
};
