import {
    spiralize_matrix,
    twts,
    dpMaximumSubarray,
    find_best_single_trade,
    find_cumulative_profit,
    unique_paths_with_obstacles,
    unique_paths_i,
    find_largest_prime_factor,
    array_jumping_can_win,
    array_jumping_generate_graph,
    array_jumping_traverse_graph,
    range,
    minSumPath,
    attemptContract,
    autoSolve
} from "./sing.codingcontracts";

function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);
        
        scan(ns, server, child, list);
    }
}

export function list_servers(ns) {
    const list = [];
    scan(ns, '', 'home', list);
    return list;
}

export async function main(ns) {
    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script helps you find an unsolved coding contract.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    let servers = list_servers(ns);
    const boughtServers = ns.getPurchasedServers(ns);
    servers = servers.filter(s => !boughtServers.includes(s));
    servers.filter(server => ns.ls(server).find(f => f.endsWith(".cct"))).forEach(server => ns.tprint(server," : ", ns.ls(server).filter(f => f.endsWith(".cct")).join(", "))); // works



    for (let server of servers) {
        if (ns.ls(server,".cct").length > 0) {
            var contractName = ns.ls(server, ".cct")[0];
            var contractData = ns.codingcontract.getData(contractName, server);
            var contractType = ns.codingcontract.getContractType(contractName, server);
            ns.tprint("Attempting Solution for ", contractType, " on ", server);
            attemptContract(contractName, contractType, contractData, server);

        }
    }



}