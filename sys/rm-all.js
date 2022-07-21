export const main = async (ns) => {
    let args = ns.args;
    let server = args[0];
    if (typeof server !== "string") {
        return;
    }
    for (const file of ns.ls(server)) {
        if (!file.endsWith(".exe") && !(file.endsWith(".msg"))) {
            // ns.tprint(file)
            ns.rm(file, server);
        }
    }
};
