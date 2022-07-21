import { CITIES } from "modules/cities/CityEnums";
import { Factions, FactionNames, FactionType } from "modules/factions/FactionEnums";
class Faction {
    constructor(ns, name) {
        this.name = "";
        this.hostname = "";
        this.ticker = "";
        this.invited = false;
        this.augmentations = [];
        this.rep = 0;
        this.favor = 0;
        this.blocked = false;
        this.member = false;
        this.enemies = [];
        this.offers_field = false;
        this.offers_hacking = false;
        this.offers_security = false;
        this.keep_on_reset = false;
        this.city = null;
        this.type = FactionType.Special;
        this.aug_req = 0;
        this.cash_req = 0;
        this.hack_req = 0;
        this.combat_req = 0;
        this.karma_req = 0;
        this.reputation_req = 0;
        this.backdoor_req = "";
        this.hnet_req = { level: 0, ram: 0, core: 0 };
        this.id = Factions[name];
        this.name = name;
        switch (this.name) {
            // EndGame
            case FactionNames[FactionNames.Illuminati]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.aug_req = 30;
                this.cash_req = 1.5e10;
                this.hack_req = 1500;
                this.combat_req = 1200;
                this.type = FactionType.Endgame;
                break;
            case FactionNames[FactionNames.Daedalus]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.aug_req = 30;
                this.cash_req = 100;
                this.hack_req = 2500;
                this.type = FactionType.Endgame;
                break;
            case FactionNames[FactionNames.TheCovenant]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.aug_req = 20;
                this.cash_req = 7.5e10;
                this.hack_req = 850;
                this.combat_req = 850;
                this.type = FactionType.Endgame;
                break;
            // Corporations
            case FactionNames[FactionNames.ECorp]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "ecorp";
                this.ticker = "ECP";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.MegaCorp]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "megacorp";
                this.ticker = "MGCP";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.BachmanAssociates]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "b-and-a";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.BladeIndustries]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "blade";
                this.ticker = "BLD";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.NWO]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "nwo";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.ClarkeIncorporated]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "clarkinc";
                this.ticker = "CLRK";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.OmniTekIncorporated]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "omnitek";
                this.ticker = "OMTK";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.FourSigma]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "4sigma";
                this.ticker = "FSIG";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.KuaiGongInternational]:
                this.offers_hacking = true;
                this.offers_field = true;
                this.offers_security = true;
                this.keep_on_reset = true;
                this.reputation_req = 2e5;
                this.hostname = "kuai-gong";
                this.ticker = "KGI";
                this.type = FactionType.Corporation;
                break;
            case FactionNames[FactionNames.FulcrumSecretTechnologies]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.keep_on_reset = true;
                this.backdoor_req = "fulcrumassets";
                this.reputation_req = 2.5e5;
                this.hostname = "fulcrumassets";
                this.ticker = "FLCM";
                this.type = FactionType.Corporation;
                break;
            // Hacking Groups
            case FactionNames[FactionNames.BitRunners]:
                this.offers_hacking = true;
                this.backdoor_req = "run4theh111z";
                this.hostname = "run4theh111z";
                this.type = FactionType.Hacking;
                break;
            case FactionNames[FactionNames.TheBlackHand]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.backdoor_req = "I.I.I.I";
                this.hostname = "I.I.I.I";
                this.type = FactionType.Hacking;
                break;
            case FactionNames[FactionNames.NiteSec]:
                this.offers_hacking = true;
                this.backdoor_req = "avmnite-02h";
                this.hostname = "avmnite-02h";
                this.type = FactionType.Hacking;
                break;
            case FactionNames[FactionNames.CyberSec]:
                this.offers_hacking = true;
                this.backdoor_req = "CSEC";
                this.hostname = "CSEC";
                this.type = FactionType.Hacking;
                break;
            // Cities
            case FactionNames[FactionNames.Aevum]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.enemies = [
                    FactionNames[FactionNames.Chongqing],
                    FactionNames[FactionNames.Ishima],
                    FactionNames[FactionNames.NewTokyo],
                    FactionNames[FactionNames.Volhaven],
                ];
                this.city = CITIES[CITIES.Aevum];
                this.cash_req = 4e7;
                this.type = FactionType.City;
                break;
            case FactionNames[FactionNames.Chongqing]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.enemies = [
                    FactionNames[FactionNames.Sector12],
                    FactionNames[FactionNames.Aevum],
                    FactionNames[FactionNames.Volhaven],
                ];
                this.city = CITIES[CITIES.Chongqing];
                this.cash_req = 2e7;
                this.type = FactionType.City;
                break;
            case FactionNames[FactionNames.Ishima]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.enemies = [
                    FactionNames[FactionNames.Sector12],
                    FactionNames[FactionNames.Aevum],
                    FactionNames[FactionNames.Volhaven],
                ];
                this.city = CITIES[CITIES.Ishima];
                this.cash_req = 3e7;
                this.type = FactionType.City;
                break;
            case FactionNames[FactionNames.NewTokyo]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.enemies = [
                    FactionNames[FactionNames.Sector12],
                    FactionNames[FactionNames.Aevum],
                    FactionNames[FactionNames.Volhaven],
                ];
                this.city = CITIES[CITIES.NewTokyo];
                this.cash_req = 2e7;
                this.type = FactionType.City;
                break;
            case FactionNames[FactionNames.Sector12]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.enemies = [
                    FactionNames[FactionNames.Chongqing],
                    FactionNames[FactionNames.Ishima],
                    FactionNames[FactionNames.NewTokyo],
                    FactionNames[FactionNames.Volhaven],
                ];
                this.city = CITIES[CITIES.Sector12];
                this.cash_req = 1.5e7;
                this.type = FactionType.City;
                break;
            case FactionNames[FactionNames.Volhaven]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.enemies = [
                    FactionNames[FactionNames.Sector12],
                    FactionNames[FactionNames.Aevum],
                    FactionNames[FactionNames.Chongqing],
                    FactionNames[FactionNames.Ishima],
                    FactionNames[FactionNames.NewTokyo],
                ];
                this.city = CITIES[CITIES.Volhaven];
                this.cash_req = 5e7;
                this.type = FactionType.City;
                break;
            case FactionNames[FactionNames.TianDiHui]:
                this.offers_hacking = true;
                this.offers_security = true;
                this.city = CITIES[CITIES.Chongqing];
                this.cash_req = 1e7;
                this.hack_req = 50;
                this.type = FactionType.City;
                break;
            // Criminal
            case FactionNames[FactionNames.SpeakersForTheDead]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.hack_req = 100;
                this.combat_req = 300;
                this.karma_req = -45;
                this.type = FactionType.Criminal;
                break;
            case FactionNames[FactionNames.TheDarkArmy]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.hack_req = 300;
                this.combat_req = 300;
                this.karma_req = -45;
                this.city = CITIES[CITIES.Chongqing];
                this.type = FactionType.Criminal;
                break;
            case FactionNames[FactionNames.TheSyndicate]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.offers_security = true;
                this.hack_req = 200;
                this.combat_req = 200;
                this.cash_req = 1e8;
                this.karma_req = -90;
                this.city = CITIES[CITIES.Sector12];
                this.type = FactionType.Criminal;
                break;
            case FactionNames[FactionNames.Silhouette]:
                this.offers_field = true;
                this.offers_hacking = true;
                this.cash_req = 1.5e7;
                this.karma_req = -22;
                this.type = FactionType.Criminal;
                break;
            case FactionNames[FactionNames.Tetrads]:
                this.offers_field = true;
                this.offers_security = true;
                this.combat_req = 75;
                this.karma_req = -18;
                this.city = CITIES[CITIES.Chongqing];
                this.type = FactionType.Criminal;
                break;
            case FactionNames[FactionNames.SlumSnakes]:
                this.offers_field = true;
                this.offers_security = true;
                this.combat_req = 30;
                this.karma_req = -9;
                this.cash_req = 1e6;
                this.type = FactionType.Criminal;
                break;
            // Special
            case FactionNames[FactionNames.Netburners]:
                this.offers_hacking = true;
                this.hnet_req = { level: 100, ram: 8, core: 4 };
                this.type = FactionType.Special;
                break;
            case FactionNames[FactionNames.Bladeburners]:
                this.type = FactionType.Special;
                break;
            case FactionNames[FactionNames.ChurchOfTheMachineGod]:
                this.keep_on_reset = true;
                this.type = FactionType.Special;
                break;
            case FactionNames[FactionNames.ShadowsOfAnarchy]:
                this.keep_on_reset = true;
                this.type = FactionType.Special;
                break;
            default:
                break;
        }
    }
}
/**
 * Returns a list of Faction objects
 */
export const FactionInfo = {
    all(ns) {
        for (const fname in FactionNames) {
            Factions[fname] = new Faction(ns, fname);
        }
        return Factions;
    },
    detail(ns, fname) {
        return new Faction(ns, fname);
    }
};
