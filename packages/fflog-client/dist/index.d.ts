export declare const getCharZoneRanks: (name: string, slug: string, region: string) => Promise<ZoneRanking[]>;
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
