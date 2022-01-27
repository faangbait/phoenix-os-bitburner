export async function main(ns) {

    for (let file of ns.ls("home", "bin.")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    for (let file of ns.ls("home", "etc.")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    for (let file of ns.ls("home", "lib.")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    for (let file of ns.ls("home", "sbin.")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    for (let file of ns.ls("home", "strategy.")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    for (let file of ns.ls("home", "var.")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    for (let file of ns.ls("home", "utils/")) {
        if (await ns.prompt(`Really delete ${file}?`)) { ns.rm(file);}
    }
    
}