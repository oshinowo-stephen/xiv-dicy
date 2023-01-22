export declare const getCharZoneRanks: (name: string, slug: string, region: string) => Promise<ZoneRanking[]>;
export declare const getEncounterCharRanks: (name: string, slug: string, region: string, enounterID: number) => Promise<any>;
interface ZoneRanking {
    encounter: Encounter;
    bestSpec: string;
    totalKills: number;
    rankPercent: number;
    fastestKill: number;
}
interface Encounter {
    id: number;
    name: string;
}
export {};
