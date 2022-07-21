import { PlayerInfo } from "modules/players/Players";
import { PlayerCache } from "modules/players/PlayerCache";
export const main = async (ns) => {
    const player = PlayerInfo.detail(ns);
    await PlayerCache.update(ns, player);
};
