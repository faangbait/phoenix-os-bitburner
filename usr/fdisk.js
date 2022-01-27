export async function main(ns) {
    if (await ns.prompt("WARNING: This will delete every file from your hard drive. Are you sure?")) {
        let files = ns.ls("home");
        for (let file of files) {
            if (![
                    "NUKE.exe",
                    "BruteSSH.exe",
                    "FTPCrack.exe",
                    "relaySMTP.exe",
                    "HTTPWorm.exe",
                    "SQLInject.exe",
                    "Formulas.exe",
                    "Autolink.exe",
                    "DeepscanV1.exe",
                    "DeepscanV2.exe"
                ].includes(file)) {
                ns.rm(file);
            }

        }
    }

}