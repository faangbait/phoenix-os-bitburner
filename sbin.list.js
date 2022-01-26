import { avahi_browse } from "./etc.x11";
import { getAllServers } from "./lib.serverextras.so";
import serverFactory from "./lib.server.so";

export async function main(ns){
    globalThis.ns = ns;
    let list = getAllServers(ns);
    let objs = list.map(s => serverFactory(s));
    avahi_browse(ns, objs);
}