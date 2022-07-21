export const main = async (ns) => {
    let args = ns.args;
    let type = args[0];
    if (typeof type !== "string") {
        return;
    }
    ns.singularity.commitCrime(type);
};
