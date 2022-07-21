import { CONTROL_SEQUENCES, PORTS } from "lib/Database";
import { TermLogger } from "lib/Logger";
import PrettyTable from "lib/PrettyTable";
import { BIN_SCRIPTS, SINGULARITY_SCRIPTS, SYS_SCRIPTS } from "lib/Variables";
import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
import { PlayerInfo } from "modules/players/Players";
import { ServerInfo } from "modules/servers/Servers";
import { ServerFuncs } from "modules/servers/ServerFunctions";
import MinHeap from "structures/heaps/minHeap";
import { Sing } from "modules/Singularity";
export default class DaemonDefault {
    constructor(ns, servers, player) {
        this.bn = BitNodeCache.read(ns, 'current');
        this.logger = new TermLogger(ns);
        this.module = "DAEMON_DEFAULT";
    }
    active_control_sequence(ns, servers, player) {
        if (player.ports < 5) {
            if (["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"].map(s => ServerInfo.detail(ns, s)).filter(s => player.ports < s.ports.required &&
                player.hacking.level >= s.level).length > 0) {
                return CONTROL_SEQUENCES.LIQUIDATE_CAPITAL;
            }
        }
        return null;
    }
    disqualify_attacker(ns, a) {
        return false;
    }
    disqualify_target(ns, t) {
        return false;
    }
    prepare_attacker(ns, a) {
        return a;
    }
    prepare_target(ns, t) {
        return t;
    }
    select_hack_algorithm(ns, attackers, targets, player) {
        let home = ServerInfo.detail(ns, "home");
        // if (home.power < 11) {
        return this.__hack_default(ns, attackers, targets, player);
        // } else {
        //     return this.__hack_hwgw(ns, attackers, targets, player);
        // }
    }
    __template(ns) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        return bundles;
    }
    __hacknet(ns) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        if (ns.ps("home").filter(proc => proc.filename == SYS_SCRIPTS.HACKNET).length === 0) {
            bundles.push({
                file: SYS_SCRIPTS.HACKNET,
                priority: 9
            });
        }
        return bundles;
    }
    __market(ns) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        switch (ns.peek(PORTS.control)) {
            case CONTROL_SEQUENCES.LIQUIDATE_CAPITAL:
                if (ns.ps("home").filter(proc => proc.filename == SYS_SCRIPTS.MARKET).length > 0) {
                    bundles.push({
                        file: SYS_SCRIPTS.MARKET,
                        args: ["-l"],
                        priority: -99
                    });
                }
                break;
            default:
                if (ns.ps("home").filter(proc => proc.filename == SYS_SCRIPTS.MARKET).length === 0) {
                    bundles.push({
                        file: SYS_SCRIPTS.MARKET,
                        args: [],
                        priority: 0
                    });
                }
                break;
        }
        return bundles;
    }
    __buy_software(ns, max_ports = 5) {
        let player = PlayerInfo.detail(ns);
        let bundles = [];
        if (Sing.has_access(ns)) {
            if (player.ports < 5) {
                let target = {
                    0: 7e5,
                    1: 1.5e6,
                    2: 5e6,
                    3: 3e7,
                    4: 2.5e8
                };
                if (player.money > target[player.ports] && player.ports < max_ports) {
                    bundles.push({
                        file: SINGULARITY_SCRIPTS.SOFTWARE_PURCHASE,
                        priority: 0,
                    });
                }
            }
        }
        return bundles;
    }
    __start_faction_work(ns, faction_name, type, force = false) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        if (Sing.has_access(ns) && (!player.work.isWorking || force)) {
            if (!player.faction.membership.includes(faction_name)) {
                bundles.push({
                    file: SINGULARITY_SCRIPTS.FACTION_JOIN,
                    args: [faction_name]
                });
            }
            bundles.push({
                file: SINGULARITY_SCRIPTS.FACTION_WORK,
                args: [faction_name, type, force]
            });
        }
        return [];
    }
    __start_company_work(ns, company_name, position, force = false) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        if (Sing.has_access(ns) && (!player.work.isWorking || force)) {
            if (player.company.companyName !== company_name) {
                bundles.push({
                    file: SINGULARITY_SCRIPTS.COMPANY_APPLY,
                    args: [company_name, position]
                });
            }
            bundles.push({
                file: SINGULARITY_SCRIPTS.COMPANY_WORK,
                args: [company_name, true]
            });
        }
        return bundles;
    }
    __start_crime(ns, crime_name, force = false) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        if (Sing.has_access(ns) && (!player.work.isWorking || force)) {
            bundles.push({
                file: SINGULARITY_SCRIPTS.CRIMES_COMMIT,
                args: [crime_name]
            });
        }
        return bundles;
    }
    __start_software(ns, software_name, force = false) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        if (Sing.has_access(ns) && (!player.work.isWorking || force)) {
            bundles.push({
                file: SINGULARITY_SCRIPTS.SOFTWARE_WRITE,
                args: [software_name]
            });
        }
        return bundles;
    }
    __purchase_servers(ns, attackers, max_servers = 25, min_size = 6) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        // TODO: Bitnode multipliers
        const ram = (power) => { return Math.pow(2, power); };
        const purchase_cost = (power) => { return ram(power) * 55000; };
        const can_afford_server = (power) => { return attackers.filter(s => s.isHome)[0].money.available >= purchase_cost(power); };
        let purchased_servers = attackers.filter(s => s.purchased);
        let strongest_server;
        let weakest_server;
        if (purchased_servers.length > 0) {
            strongest_server = purchased_servers.reduce((max, cur) => cur.power > max.power ? cur : max);
            weakest_server = purchased_servers.reduce((min, cur) => cur.power < min.power ? cur : min);
        }
        else {
            strongest_server = attackers.filter(s => s.isHome)[0];
            weakest_server = attackers.filter(s => s.isHome)[0];
        }
        let next_upgrade = Math.max(min_size, strongest_server.power + 1);
        // sell servers
        if (purchased_servers.length === max_servers && can_afford_server(next_upgrade) && weakest_server.power < 18) {
            bundles.push({
                file: SYS_SCRIPTS.PURCHASE_SVR,
                args: ["sell", weakest_server.hostname]
            });
            purchased_servers.pop(); // doesn't matter what we pop, we're about to buy a replacement
        }
        else {
            this.logger.info(`Not attempting to sell server: ${purchased_servers.length} < ${max_servers}; ${next_upgrade} cost ${purchase_cost(next_upgrade)}; weakest: ${weakest_server.power}`);
        }
        // buy servers
        if (purchased_servers.length < max_servers && can_afford_server(next_upgrade)) {
            bundles.push({
                file: SYS_SCRIPTS.PURCHASE_SVR,
                args: ["buy", "cluster-", ram(next_upgrade)]
            });
        }
        else {
            this.logger.info(`Not attempting to buy server: ${purchased_servers.length} >= ${max_servers}; ${next_upgrade} cost ${purchase_cost(next_upgrade)}; strongest: ${strongest_server.power}`);
        }
        return bundles;
    }
    __upgrade_home(ns, type) {
        let bundles = [];
        if (Sing.has_access(ns)) {
            bundles.push({
                file: SINGULARITY_SCRIPTS.SOFTWARE_UPGRADEHOME,
                args: [type]
            });
        }
        return bundles;
    }
    /**
     * Logic to select the best focus task, one of:
     * Work for Faction
     * Work for Company
     * Crimes
     * Create Software
     */
    find_focus_task(ns, attackers, player) {
        let bundles = [];
        if (false) {
            let company_name = "";
            let position = "";
            return this.__start_company_work(ns, company_name, position, true);
        }
        if (false) {
            let faction_name = "";
            let type = "Hacking";
            return this.__start_faction_work(ns, faction_name, type, true);
        }
        if (false) {
            let crime_name = "shoplift";
            return this.__start_crime(ns, crime_name);
        }
        if (false) {
            let software_name = "NUKE.exe";
            return this.__start_software(ns, software_name);
        }
        return bundles;
    }
    /**
     * Main entrypoint for logic
     */
    generate_action_bundle(ns, attackers, targets) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        if (player.ports < 5) {
            bundles.push(...this.__buy_software(ns));
        }
        if (player.level < 10 && ![8].includes(this.bn.number)) {
            bundles.push(...this.__hacknet(ns));
        }
        if (player.market.api.tix) {
            bundles.push(...this.__market(ns));
        }
        if (player.ports >= 5 && ![8].includes(this.bn.number)) {
            bundles.push(...this.__purchase_servers(ns, attackers));
        }
        if (bundles.length > 0) { // shortcircuit hack selection if we have other scripts to start
            return bundles;
        }
        return this.select_hack_algorithm(ns, attackers, targets, player);
    }
    deploy_package(ns, bundle) {
        return ns.exec(bundle.file, bundle.attacker || "home", bundle.threads, ...bundle.args || []);
    }
    iterate(ns, servers, legal_attackers, legal_targets, prepared_attackers, prepared_targets, bundles, pids) {
        // return
        ns.clearLog();
        let pt = new PrettyTable();
        let headers = ["TARGET", "SCRIPT", "THREADS"];
        let targets = new Map();
        bundles.forEach(b => {
            let target_id = "home";
            if (b.args && b.args[0]) {
                target_id = b.args[0].toString();
            }
            let targets_map = targets.get(target_id);
            if (!targets_map) {
                targets.set(target_id, new Map());
                targets_map = targets.get(target_id);
            }
            let threads = targets_map.get(b.file);
            if (!threads) {
                targets_map.set(b.file, 0);
                threads = 0;
            }
            targets_map.set(b.file, threads + (b.threads || 1));
        });
        let rows = [];
        for (const [id, file_map] of targets) {
            for (const [file, threads] of file_map) {
                rows.push([id, file, threads.toString()]);
            }
        }
        pt.create(headers, rows);
        ns.print(this.module);
        ns.print(pt.print());
    }
    /**
     * Core methods, no overrides below
     */
    async __send_control_sequences(ns, servers, player) {
        let cs = this.active_control_sequence(ns, servers, player);
        ns.clearPort(PORTS.control);
        if (cs) {
            await ns.writePort(PORTS.control, cs);
        }
        return cs;
    }
    __get_attackers(ns, servers) {
        return servers.filter(s => s.isAttacker && !this.disqualify_attacker(ns, s));
    }
    __get_targets(ns, servers) {
        return servers.filter(s => s.isTarget && !this.disqualify_target(ns, s));
    }
    __prepare_attackers(ns, servers) {
        return servers.map(s => this.prepare_attacker(ns, s));
    }
    __prepare_targets(ns, servers) {
        return servers.map(s => this.prepare_target(ns, s));
    }
    __package(ns, attackers, targets, player) {
        return [...this.find_focus_task(ns, attackers, player), ...this.generate_action_bundle(ns, attackers, targets)];
    }
    __deploy(ns, bundles) {
        bundles.sort((a, b) => (a.priority || 10) - (b.priority || 10));
        return bundles.map(b => this.deploy_package(ns, b));
    }
    __iterate(ns, results) {
        return this.iterate(ns, results.servers, results.legal_attackers, results.prepared_attackers, results.legal_targets, results.prepared_targets, results.bundles, results.pids);
    }
    __hack_default(ns, attackers, targets, player) {
        let bundles = [];
        let target_heap = new MinHeap();
        let attacker_heap = new MinHeap();
        let target_batch_req = new Map();
        let files = [
            {
                job: "hack",
                filename: BIN_SCRIPTS.BASIC_HACK,
                ram: 1.7,
            },
            {
                job: "grow",
                filename: BIN_SCRIPTS.BASIC_GROW,
                ram: 1.75,
            },
            {
                job: "weaken",
                filename: BIN_SCRIPTS.BASIC_WEAK,
                ram: 1.75,
            }
        ];
        let smallest_ram = Math.min(...files.map(f => f.ram));
        for (const t of targets) {
            let thread_batch = {
                h_threads: 0,
                g_threads: 0,
                w_threads: 0
            };
            if (t.money.available / t.money.max > .9 && t.security.level <= t.security.min + 1) {
                thread_batch.h_threads = Math.ceil(ns.hackAnalyzeThreads(t.id, t.money.available * .05));
            }
            if (t.money.available / t.money.max <= .9 && t.security.level <= t.security.min + 1) {
                if (isFinite(t.money.max / t.money.available)) {
                    thread_batch.g_threads = Math.ceil(ns.growthAnalyze(t.id, t.money.max / t.money.available));
                }
                else {
                    thread_batch.g_threads = Math.ceil(ns.growthAnalyze(t.id, t.money.max / 1000));
                }
            }
            if (t.security.level > t.security.min) {
                thread_batch.w_threads = Math.ceil((t.security.level - t.security.min) / .05);
            }
            for (let key in thread_batch) {
                if (!isFinite(thread_batch[key])) {
                    thread_batch[key] = 10000;
                }
                thread_batch[key] = Math.max(0, thread_batch[key]);
            }
            let sum_threads = [
                thread_batch.h_threads,
                thread_batch.g_threads,
                thread_batch.w_threads
            ].reduce((a, c) => a + c, 0);
            if (sum_threads > 0) {
                target_batch_req.set(t.id, thread_batch);
                target_heap.enqueue(t.id, sum_threads);
            }
        }
        if (target_heap.size == 0) {
            return [];
        }
        attacker_heap.buildHeap(new Map(attackers.filter(a => a.ram.free > smallest_ram).map(a => [a.id, a.ram.free])), []);
        let next_target = target_heap.dequeue();
        while (next_target) {
            if (!target_batch_req.has(next_target.key)) {
                next_target = target_heap.dequeue();
                continue;
            }
            let target = next_target.key;
            let thread_batch = target_batch_req.get(next_target.key);
            if (!thread_batch) {
                next_target = target_heap.dequeue();
                continue;
            }
            let next_attacker = attacker_heap.findMin();
            while (next_attacker) {
                let a = next_attacker.key;
                let ram = next_attacker.val;
                for (const file of files) {
                    let threads = 0;
                    if (file.job === "weaken" && thread_batch.w_threads > 0) {
                        threads = Math.floor(Math.min(ram / file.ram, thread_batch.w_threads));
                        thread_batch.w_threads -= threads;
                    }
                    if (file.job === "grow" && thread_batch.g_threads > 0) {
                        threads = Math.floor(Math.min(ram / file.ram, thread_batch.g_threads));
                        thread_batch.g_threads -= threads;
                    }
                    if (file.job === "hack" && thread_batch.h_threads > 0) {
                        threads = Math.floor(Math.min(ram / file.ram, thread_batch.h_threads));
                        thread_batch.h_threads -= threads;
                    }
                    if (threads > 0) {
                        bundles.push({
                            file: file.filename,
                            attacker: a,
                            threads: threads,
                            args: [target, true]
                        });
                        ram -= (threads * file.ram);
                    }
                }
                if (ram < smallest_ram) {
                    attacker_heap.deleteKey(a);
                }
                else {
                    attacker_heap.decreaseKey(a, ram);
                }
                if ([
                    thread_batch.h_threads,
                    thread_batch.g_threads,
                    thread_batch.w_threads
                ].reduce((a, c) => a + c, 0) > 0) {
                    next_attacker = attacker_heap.findMin();
                }
                else {
                    next_attacker = null;
                }
            }
            next_target = target_heap.dequeue();
        }
        let next_attacker = attacker_heap.dequeue();
        while (next_attacker) {
            let a = next_attacker.key;
            let ram = next_attacker.val;
            let file = files.filter(f => f.job === "weaken")[0];
            if (ram >= file.ram) {
                bundles.push({
                    file: file.filename,
                    attacker: a,
                    threads: Math.floor(ram / file.ram),
                    args: ["n00dles", true]
                });
            }
            next_attacker = attacker_heap.dequeue();
        }
        return bundles;
    }
    __hack_hwgw(ns, attackers, targets, player) {
        let bundles = [];
        let target_heap = new MinHeap();
        let attacker_heap = new MinHeap();
        let files = [
            {
                job: "hack",
                filename: BIN_SCRIPTS.FUTURE_HACK,
                ram: 1.75,
            },
            {
                job: "grow",
                filename: BIN_SCRIPTS.FUTURE_GROW,
                ram: 1.8,
            },
            {
                job: "weaken",
                filename: BIN_SCRIPTS.FUTURE_WEAK,
                ram: 1.8,
            }
        ];
        let target_batch_req = new Map();
        for (const t of targets) {
            let thread_batch = {
                h_threads: 0,
                g_threads: 0,
                w1_threads: 0,
                w2_threads: 0,
            };
            if (t.money.available >= t.money.max && t.security.level <= t.security.min) {
                thread_batch.h_threads = Math.ceil(ns.hackAnalyzeThreads(t.id, t.money.max * .10));
                thread_batch.g_threads = Math.ceil(ns.growthAnalyze(t.id, 1 / .10));
                thread_batch.w1_threads = Math.ceil(thread_batch.h_threads * .002);
                thread_batch.w2_threads = Math.ceil(thread_batch.g_threads * .004);
            }
            else {
                if (isFinite(t.money.max / t.money.available)) {
                    thread_batch.g_threads = Math.ceil(ns.growthAnalyze(t.id, t.money.max / t.money.available));
                }
                else {
                    thread_batch.g_threads = 10;
                }
                thread_batch.w1_threads = Math.ceil((t.security.level - t.security.min) / .05);
                thread_batch.w2_threads = Math.ceil(thread_batch.g_threads * .004);
            }
            let sum_threads = [
                thread_batch.h_threads,
                thread_batch.g_threads,
                thread_batch.w1_threads,
                thread_batch.w2_threads
            ].reduce((a, c) => a + c, 0);
            if (sum_threads > 0) {
                target_batch_req.set(t.id, thread_batch);
                target_heap.enqueue(t.id, sum_threads);
            }
        }
        if (target_heap.size === 0) {
            return [];
        }
        attacker_heap.buildHeap(new Map(attackers.filter(a => a.ram.free > 1.8).map(a => [a.id, a.ram.free])), []);
        let next_target = target_heap.dequeue();
        let next_launch_date = new Date().valueOf() + 100;
        let spacing = 50;
        while (next_target) {
            next_launch_date += 100;
            if (!target_batch_req.has(next_target.key)) {
                next_target = target_heap.dequeue();
                continue;
            }
            let target = next_target.key;
            let thread_batch = target_batch_req.get(next_target.key);
            if (!thread_batch) {
                next_target = target_heap.dequeue();
                continue;
            }
            let next_attacker = attacker_heap.dequeue();
            while (next_attacker) {
                let a = next_attacker.key;
                let ram = next_attacker.val;
                if (ram > thread_batch.w1_threads * 1.8) {
                    ram -= thread_batch.w1_threads * 1.8;
                    bundles.push({
                        file: BIN_SCRIPTS.FUTURE_WEAK,
                        attacker: a,
                        threads: thread_batch.w1_threads,
                        args: [target, next_launch_date + spacing + ns.getHackTime(target)]
                    });
                }
                if (ram > thread_batch.w2_threads * 1.8) {
                    ram -= thread_batch.w2_threads * 1.8;
                    bundles.push({
                        file: BIN_SCRIPTS.FUTURE_WEAK,
                        attacker: a,
                        threads: thread_batch.w2_threads,
                        args: [target, next_launch_date + (3 * spacing) + ns.getHackTime(target)]
                    });
                }
                if (ram > thread_batch.g_threads * 1.8) {
                    ram -= thread_batch.g_threads * 1.8;
                    bundles.push({
                        file: BIN_SCRIPTS.FUTURE_GROW,
                        attacker: a,
                        threads: thread_batch.g_threads,
                        args: [target, next_launch_date + (2 * spacing) + ns.getHackTime(target)]
                    });
                }
                if (ram > thread_batch.h_threads * 1.75) {
                    ram -= thread_batch.h_threads * 1.75;
                    bundles.push({
                        file: BIN_SCRIPTS.FUTURE_HACK,
                        attacker: a,
                        threads: thread_batch.h_threads,
                        args: [target, next_launch_date + ns.getHackTime(target)]
                    });
                }
                next_attacker = attacker_heap.dequeue();
            }
            next_target = target_heap.dequeue();
        }
        return bundles;
    }
    __hack_hwgw1(ns, attackers, targets, player) {
        let bundles = [];
        let required_threads = new Map();
        let files = [
            {
                job: "hack",
                filename: BIN_SCRIPTS[BIN_SCRIPTS.BASIC_HACK],
                ram: 1.7,
            },
            {
                job: "grow",
                filename: BIN_SCRIPTS[BIN_SCRIPTS.BASIC_GROW],
                ram: 1.75,
            },
            {
                job: "weaken",
                filename: BIN_SCRIPTS[BIN_SCRIPTS.BASIC_WEAK],
                ram: 1.75,
            }
        ];
        for (const t of targets) {
            let thread_batch = {
                h_threads: 0,
                g_threads: 0,
                w_threads: 0
            };
            if (t.money.available / t.money.max > .9 && t.security.level <= t.security.min + 1) {
                thread_batch.h_threads = Math.ceil(ns.hackAnalyzeThreads(t.id, t.money.available * .05));
            }
            if (t.money.available / t.money.max <= .9 && t.security.level <= t.security.min + 1) {
                thread_batch.g_threads = Math.ceil(ns.growthAnalyze(t.id, (t.money.max / Math.max(t.money.available, 1))));
            }
            if (t.security.level > t.security.min) {
                thread_batch.w_threads = Math.ceil((t.security.level - t.security.min) / .05);
            }
            if (thread_batch.h_threads > 0 ||
                thread_batch.g_threads > 0 ||
                thread_batch.w_threads > 0) {
                required_threads.set(t.id, thread_batch);
            }
        }
        let targeted_servers = Array.from(required_threads.entries());
        targeted_servers.sort(([a_id, a_threads], [b_id, b_threads]) => (a_threads.g_threads + a_threads.h_threads + a_threads.w_threads) - (b_threads.g_threads + b_threads.h_threads + b_threads.w_threads));
        for (const [t_id, thread_batch] of targeted_servers) {
            for (const a of attackers) {
                let assigned_ram = 0;
                for (const file of files) {
                    switch (file.job) {
                        case "hack":
                            if (thread_batch.h_threads > 0) {
                                let threads = Math.min(ServerFuncs.threadCount(a, file.ram), thread_batch.h_threads);
                                if (threads > 0) {
                                    bundles.push({
                                        file: file.filename,
                                        attacker: a.id,
                                        threads: threads,
                                        args: [t_id, true]
                                    });
                                    assigned_ram += threads * file.ram;
                                }
                            }
                            break;
                        case "grow":
                            if (thread_batch.g_threads > 0) {
                                let threads = Math.min(ServerFuncs.threadCount(a, file.ram), thread_batch.g_threads);
                                if (threads > 0) {
                                    bundles.push({
                                        file: file.filename,
                                        attacker: a.id,
                                        threads: threads,
                                        args: [t_id, true]
                                    });
                                    assigned_ram += threads * file.ram;
                                }
                            }
                            break;
                        case "weaken":
                            if (thread_batch.w_threads > 0) {
                                let threads = Math.min(ServerFuncs.threadCount(a, file.ram), thread_batch.w_threads);
                                if (threads > 0) {
                                    bundles.push({
                                        file: file.filename,
                                        attacker: a.id,
                                        threads: threads,
                                        args: [t_id, true]
                                    });
                                    assigned_ram += threads * file.ram;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return bundles;
    }
    __hack_max_xp(ns, attackers, targets, player) {
        let bundles = [];
        let file = { job: "weaken", filename: BIN_SCRIPTS.BASIC_WEAK, ram: 1.75 };
        for (const a of attackers) {
            let threads = ServerFuncs.threadCount(a, file.ram);
            if (threads > 0) {
                bundles.push({
                    file: file.filename,
                    attacker: a.id,
                    threads: threads,
                    args: ["n00dles", a.isHome]
                });
            }
        }
        return bundles;
    }
    __hack_cash(ns, attackers, targets, player) {
        let bundles = [];
        let file = { job: "hack", filename: BIN_SCRIPTS.BASIC_HACK, ram: 1.7 };
        let target_heap = new MinHeap();
        let attacker_heap = new MinHeap();
        for (const t of targets) {
            target_heap.enqueue(t.id, Math.ceil(ns.hackAnalyzeThreads(t.id, t.money.available)));
        }
        attacker_heap.buildHeap(new Map(attackers.filter(a => a.ram.free > file.ram).map(a => [a.id, a.ram.free])), []);
        let next_target = target_heap.dequeue();
        while (next_target) {
            let threads = next_target.val;
            let target = next_target.key;
            let next_attacker = attacker_heap.dequeue();
            while (next_attacker) {
                let t = Math.min(Math.floor(next_attacker.val / file.ram), threads);
                if (t > 0) {
                    bundles.push({
                        file: file.filename,
                        attacker: next_attacker.key,
                        threads: t,
                        args: [target, true]
                    });
                }
                if (threads > t) {
                    next_attacker = attacker_heap.dequeue();
                }
                else {
                    next_attacker = null;
                }
            }
            next_target = target_heap.dequeue();
        }
        return bundles;
    }
    __hack_support_stocks(ns, attackers, targets, player) {
        let symbols = new Map([
            ["ecorp", "ECP"],
            ["megacorp", "MGCP"],
            ["blade", "BLD"],
            ["clarkinc", "CLRK"],
            ["omnitek", "OMTK"],
            ["4sigma", "FSIG"],
            ["kuai-gong", "KGI"],
            ["fulcrumtech", "FLCM"],
            ["stormtech", "STM"],
            ["defcomm", "DCOMM"],
            ["helios", "HLS"],
            ["vitalife", "VITA"],
            ["icarus", "ICRS"],
            ["univ-energy", "UNV"],
            ["aerocorp", "AERO"],
            ["omnia", "OMN"],
            ["solaris", "SLRS"],
            ["global-pharm", "GPH"],
            ["nova-med", "NVMD"],
            ["lexocorp", "LXO"],
            ["rho-construction", "RHOC"],
            ["alpha-ent", "APHE"],
            ["syscore", "SYSC"],
            ["computek", "CTK"],
            ["netlink", "NTLK"],
            ["omega-net", "OMGA"],
            ["foodnstuff", "FNS"],
            ["joesguns", "JGN"],
            ["sigma-cosmetics", "SGC"],
            ["catalyst", "CTYS"],
            ["microdyne", "MDYN"],
            ["titan-labs", "TITN"],
        ]);
        let positions = JSON.parse(ns.read("/Temp/stock-getPosition.txt"));
        let bundles = [];
        let required_threads = new Map();
        for (const t of targets) {
            let thread_batch = {
                h_threads: 0,
                g_threads: 0,
                w_threads: 0
            };
            let ticker = symbols.get(t.hostname);
            if (ticker) {
                let position = positions[ticker];
                if (position) {
                    if (t.security.level > t.security.min) {
                        thread_batch.w_threads = Math.ceil((t.security.level - t.security.min) / .05);
                    }
                    if (position[0] > 0) {
                        thread_batch.g_threads = Math.ceil(ns.growthAnalyze(t.id, (t.money.max / Math.max(t.money.available, 1))));
                    }
                    if (position[2] > 0) {
                        thread_batch.h_threads = Math.ceil(ns.hackAnalyzeThreads(t.id, t.money.available));
                    }
                }
            }
            if (thread_batch.h_threads > 0 ||
                thread_batch.g_threads > 0 ||
                thread_batch.w_threads > 0) {
                required_threads.set(t.id, thread_batch);
            }
        }
        let targeted_servers = Array.from(required_threads.entries());
        targeted_servers.sort(([a_id, a_threads], [b_id, b_threads]) => (a_threads.g_threads + a_threads.h_threads) - (b_threads.g_threads + b_threads.h_threads));
        let files = [
            {
                job: "hack",
                filename: BIN_SCRIPTS.BASIC_HACK,
                ram: 1.7,
            },
            {
                job: "grow",
                filename: BIN_SCRIPTS.BASIC_GROW,
                ram: 1.75,
            },
            {
                job: "weaken",
                filename: BIN_SCRIPTS.BASIC_WEAK,
                ram: 1.75,
            }
        ];
        for (const [t_id, thread_batch] of targeted_servers) {
            for (const a of attackers) {
                let assigned_ram = 0;
                for (const file of files) {
                    switch (file.job) {
                        case "hack":
                            if (thread_batch.h_threads > 0) {
                                let threads = Math.min(ServerFuncs.threadCount(a, file.ram), thread_batch.h_threads);
                                if (threads > 0) {
                                    bundles.push({
                                        file: file.filename,
                                        attacker: a.id,
                                        threads: threads,
                                        args: [t_id, true]
                                    });
                                    assigned_ram += threads * file.ram;
                                }
                            }
                            break;
                        case "grow":
                            if (thread_batch.g_threads > 0) {
                                let threads = Math.min(ServerFuncs.threadCount(a, file.ram), thread_batch.g_threads);
                                if (threads > 0) {
                                    bundles.push({
                                        file: file.filename,
                                        attacker: a.id,
                                        threads: threads,
                                        args: [t_id, true]
                                    });
                                    assigned_ram += threads * file.ram;
                                }
                            }
                            break;
                        case "weaken":
                            if (thread_batch.w_threads > 0) {
                                let threads = Math.min(ServerFuncs.threadCount(a, file.ram), thread_batch.w_threads);
                                if (threads > 0) {
                                    bundles.push({
                                        file: file.filename,
                                        attacker: a.id,
                                        threads: threads,
                                        args: [t_id, true]
                                    });
                                    assigned_ram += threads * file.ram;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        return bundles;
    }
}
