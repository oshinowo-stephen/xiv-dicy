export declare const getCharZoneRanks: (name: string, slug: string, region: string) => Promise<ZoneRanking[]>;
export declare const getEncounterCharRanks: (name: string, slug: string, region: string, enounterID: number) => Promise<any>;
interface ZoneRanking {
    encounter: Encounter;
}
interface Encounter {
    id: number;
    name: string;
    bestSpec: string;
    totalKills: number;
    rankPercent: number;
    fastestKill: number;
}
export {};
