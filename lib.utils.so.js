import { PriorityQueue } from "./lib.structures.so";

export const fmt_cash = (money) => {
    return globalThis.ns.nFormat(money, "$0.0a");
};

export const fmt_num = (number) => {
    return globalThis.ns.nFormat(number, '0.0a');
};

export const fmt_bits = (bytes) => {
   return globalThis.ns.nFormat(bytes*1024*1024*1024, '0b');
};

export const hashpower = (servers) => {
   return servers.reduce((a,b) => a + b.power, 0);
};

export const ram = (servers) => {
   return servers.reduce((a,b) => a + b.ram.max, 0);
};

export const hashrate = (servers) => {
    return servers.reduce((a,b) => a + b.ram.used, 0);
};

export const purchased = (servers) => {
   return servers.filter(server => server.purchased);
};

export const owned = (servers) => {
    return servers.filter(server => server.admin);
};

export const fetchByHost = (servers, host) => {
     servers.filter(s => s.hostname == host)[0];
};

export const CanBuyServer = (player, servers) => {
    function purchaseCost(power) {
        return ram(power) * 55000;
    }
    
    servers.sort((a,b) => a.power - b.power);
    
    return purchased(servers).length < 25 &&
    player.money > purchaseCost(
        Math.min(
            20, (purchased(servers)[0].power + 1)
            ));
};

export const CanSellServer = (players,servers) => {
    servers.sort((a,b) => a.power - b.power);
    return purchased(servers).length == 25 && purchased(servers)[0].power < 15;
};

export const IsStrongAttacker = (server) => {
    return server.power >= (Math.pow(2,7)) && server.admin;
};

export const IsGoodTarget = (server) => {
    return server.admin && server.money.available == server.money.max && server.security.level == server.security.min;
};

export const IsPlayerWealthy = (player, servers) => {
    return player.money > Math.pow(10,12) || 
    globalThis.ns.readPort(19) > Math.pow(10,12) ||
    purchased(servers).reduce((a,b) => a + b.max.ram) > 2^22 || 
    purchased(servers).length == 25;
};

export const IsPlayerBroke = (player, servers) => {
    return player.ports < 5 || player.playtime.sinceAug < 300000 || player.hacking.level > 2500 && !player.factions.includes("Daedalus");
};


/**
 * Given n variables of various weights, create a priority queue.
 * This is the final factory function, taking an a map, e.g.
 * 
 * let weights = new Map();
 * weights.set("brush_teeth", 750);
 * weights.set("put_on_pajamas", 23);
 * weights.set("turn_off_lights", 880)
 * 
 * pq = queueFactory(weights)
 * pq.poll() -> put_on_pajamas
 * 
 * By default, we prioritize the lowest value from the list. poll_high reverses.
 * 
 * @export
 * @param {Map<K,V>} weights
 * @return {PriorityQueue} 
 */

 export function queueFactory(weights, poll_high=false) {
    const pq = new PriorityQueue();

    if (poll_high) {
        weights.forEach((v,k) => pq.add(k, v * -1));
    } else {
        weights.forEach((v,k) => pq.add(k, v));
    }
    return pq;
}
/**
 *
 *
 * @export
 * @param {Map<K,V>} weights
 * @param {Map<K,V>[]} modifiers
 * @return {Map<K,V>} 
 */
export function mergeModifiers(weights, modifiers) {
    
    for (const mod of modifiers) {
        mod.forEach((v,k) => weights.set(k, v + weights.get(k)));
        }
    return weights;
}