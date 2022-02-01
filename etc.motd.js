import { fmt_cash, fmt_num, fmt_bits, ram, purchased } from "./lib.utils.so";

/** @function */
export function banner(ns, start_time=null) {
    ns.tprint("");
    ns.tprint("");
    ns.tprint("");
    ns.tprint("");
    if (start_time) {
        let cur_time = new Date();
        let delta = cur_time.valueOf() - start_time.valueOf();
        let display = delta / 1000 / 60 ;
        ns.tprint("INFO ",ns.nFormat(display,'0.0n')," minutes since the Phoenix first rose    ", cur_time.toLocaleTimeString());
    }
    ns.tprint("INFO@@@@@@@   @@@  @@@   @@@@@@   @@@@@@@@  @@@  @@@  @@@  @@@  @@@  ");
    ns.tprint("INFO@@@@@@@@  @@@  @@@  @@@@@@@@  @@@@@@@@  @@@@ @@@  @@@  @@@  @@@  ");
    ns.tprint("INFO@@!  @@@  @@!  @@@  @@!  @@@  @@!       @@!@!@@@  @@!  @@!  !@@  ");
    ns.tprint("INFO!@!  @!@  !@!  @!@  !@!  @!@  !@!       !@!!@!@!  !@!  !@!  @!!  ");
    ns.tprint("INFO@!@@!@!   @!@!@!@!  @!@  !@!  @!!!:!    @!@ !!@!  !!@   !@@!@!   ");
    ns.tprint("INFO!!@!!!    !!!@!!!!  !@!  !!!  !!!!!:    !@!  !!!  !!!    @!!!    ");
    ns.tprint("INFO!!:       !!:  !!!  !!:  !!!  !!:       !!:  !!!  !!:   !: :!!   ");
    ns.tprint("INFO!!:       :!:  !:!  :!:  !:!  :!:       :!:  !:!  :!:  :!:  !:!  ");
    ns.tprint("INFO:!:       ::   :::  ::::: ::   :: ::::   ::   ::   ::   ::  :::  ");
    ns.tprint("INFO::         :   : :   : :  :   : :: ::   ::    :   :     :   ::   ");
    ns.tprint("                                                                     ");
    ns.tprint("                                .-==========                         ");
    ns.tprint("                             .-' O    =====                          ");
    ns.tprint("                            /___       ===                           ");
    ns.tprint("                               \_      |                             ");
    ns.tprint("    _____________________________)    (_____________________________ ");
    ns.tprint("    \___________               .'      `,              ____________/ ");
    ns.tprint("      \__________`.     |||<   `.      .'   >|||     .'__________/   ");
    ns.tprint("         \_________`._  |||  <   `-..-'   >  |||  _.'_________/      ");
    ns.tprint("            \_________`-..|_  _ <      > _  _|..-'_________/         ");
    ns.tprint("               \_________   |_|  //  \\\\  |_|   _________/            ");
    ns.tprint("                          .-\   //    \\\\   /-.                       ");
    ns.tprint("          ,  .         _.'.- `._        _.' -.`._         .  ,       ");
    ns.tprint("        <<<<>>>>     .' .'  /  '``----''`  \\  `. `.     <<<<>>>>     ");
    ns.tprint("          '/\\\`         /  .' .'.'/|..|\\`.`. `.  \\         '/\\\`       ");
    ns.tprint("          (())        `  /  / .'| |||| |`. \\  \\  '        (())       ");
    ns.tprint("           /\\\          ::_.' .' /| || |\\ `. `._::          /\\\        ");
    ns.tprint("          //\\\\           '``.' | | || | | `.''`           //\\\\       ");
    ns.tprint("          //\\\\             .` .` | || | '. '.             //\\\\       ");
    ns.tprint("          //\\\\                `  | `' |  '                //\\\\       ");
    ns.tprint("          \\\\//                                            \\\\//       ");
    ns.tprint("           \\/                  ART BY MJP                  \\/        ");
    ns.tprint("                              CODE BY TRHR                           ");

    ns.disableLog("scan");
}

export async function banner_short(ns,player, servers, gameStage, moneyStage, start_time=null) {
    if (Math.random() < 0.1) {

        ns.tprint("");
        ns.tprint("");
        if (start_time) {
            let cur_time = new Date();
            let delta = cur_time.valueOf() - start_time.valueOf();
            let display = delta / 1000 / 60 ;
            ns.tprint("INFO ",ns.nFormat(display,'0.0n')," minutes since the Phoenix first rose    ", cur_time.toLocaleTimeString());
        }
        ns.tprint("INFO@@@@@@@   @@@  @@@   @@@@@@   @@@@@@@@  @@@  @@@  @@@  @@@  @@@  ");
        ns.tprint("INFO@@@@@@@@  @@@  @@@  @@@@@@@@  @@@@@@@@  @@@@ @@@  @@@  @@@  @@@  ");
        ns.tprint("INFO@@!  @@@  @@!  @@@  @@!  @@@  @@!       @@!@!@@@  @@!  @@!  !@@  ");
        ns.tprint("INFO!@!  @!@  !@!  @!@  !@!  @!@  !@!       !@!!@!@!  !@!  !@!  @!!  ");
        ns.tprint("INFO@!@@!@!   @!@!@!@!  @!@  !@!  @!!!:!    @!@ !!@!  !!@   !@@!@!   ");
        ns.tprint("INFO!!@!!!    !!!@!!!!  !@!  !!!  !!!!!:    !@!  !!!  !!!    @!!!    ");
        ns.tprint("INFO!!:       !!:  !!!  !!:  !!!  !!:       !!:  !!!  !!:   !: :!!   ");
        ns.tprint("INFO!!:       :!:  !:!  :!:  !:!  :!:       :!:  !:!  :!:  :!:  !:!  ");
        ns.tprint("INFO:!:       ::   :::  ::::: ::   :: ::::   ::   ::   ::   ::  :::  ");
        ns.tprint("INFO::         :   : :   : :  :   : :: ::   ::    :   :     :   ::   ");
        ns.tprint("");
        
        ns.tprint(new Date().toLocaleTimeString(), "  Game Stage: ", new gameStage().constructor.name, "    Resource allocation: ", new moneyStage().constructor.name);
        
        let delta_money = player.money - player.last_money;
        let delta_xp = player.hacking.exp - player.last_xp;

        if (delta_money) {
            ns.tprint(fmt_cash(delta_money), ", ",fmt_num(delta_xp)," xp since last notice.   ", purchased(servers).length, " racked servers @ ", fmt_bits(ram(purchased(servers))), " total RAM.");
        }

        player.last_money = player.money;
        player.last_xp = player.hacking.exp;

        let factions = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
        servers.filter(server => factions.includes(server.hostname) && server.admin && !server.backdoored && player.level >= server.level)
        .forEach(server => ns.tprint("WARNING: You have admin on ", server.hostname, " but have not backdoored it yet."));
    }
}
