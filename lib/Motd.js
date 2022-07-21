export const MOTD = {
    banner(ns, start_time = null) {
        ns.tprint("");
        ns.tprint("");
        ns.tprint("");
        ns.tprint("");
        if (start_time) {
            let delta = new Date().valueOf() - start_time.valueOf();
            let display = delta / 1000 / 60;
            ns.tprint("INFO ", ns.nFormat(display, '0.0n'), " minutes since the Phoenix first rose    ", new Date().toLocaleTimeString());
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
        ns.tprint("               \_________   |_|  //  \\\\  |_|   _________/          ");
        ns.tprint("                          .-\   //    \\\\   /-.                     ");
        ns.tprint("          ,  .         _.'.- `._        _.' -.`._         .  ,       ");
        ns.tprint("        <<<<>>>>     .' .'  /  '``----''`  \\  `. `.     <<<<>>>>    ");
        ns.tprint("          '/\\\`         /  .' .'.'/|..|\\`.`. `.  \\         '/\\\` ");
        ns.tprint("          (())        `  /  / .'| |||| |`. \\  \\  '        (())     ");
        ns.tprint("           /\\\          ::_.' .' /| || |\\ `. `._::          /\\\   ");
        ns.tprint("          //\\\\           '``.' | | || | | `.''`           //\\\\   ");
        ns.tprint("          //\\\\             .` .` | || | '. '.             //\\\\   ");
        ns.tprint("          //\\\\                `  | `' |  '                //\\\\   ");
        ns.tprint("          \\\\//                                            \\\\//   ");
        ns.tprint("           \\/                  ART BY MJP                  \\/      ");
        ns.tprint("                            CODE BY @FAANGBAIT                       ");
    },
    banner_short(ns, start_time = null) {
        ns.tprint("");
        ns.tprint("");
        if (start_time) {
            let delta = new Date().valueOf() - start_time.valueOf();
            let display = delta / 1000 / 60;
            ns.tprint("INFO ", ns.nFormat(display, '0.0n'), " minutes since the Phoenix first rose    ", new Date().toLocaleTimeString());
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
        ns.tprint("                                              risen from the ashes   ");
    }
};
