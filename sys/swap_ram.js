import { TermLogger } from "lib/Logger";
import { PORTS } from "lib/Database";
export async function main(ns) {
    let logger = new TermLogger(ns);
    while (true) {
        let comms = ns.readPort(PORTS.swap);
        switch (comms) {
            case "NULL PORT DATA":
                await ns.share();
                break;
            default:
                try {
                    let command = JSON.parse(comms);
                    if (command.home_required) {
                        ns.spawn(command.file, command.threads, ...command.args);
                    }
                    else {
                        // TODO: Find server with free RAM
                    }
                }
                catch {
                    logger.err(`Error parsing JSON on port ${PORTS.swap}, received: ${comms}`);
                }
        }
    }
}
