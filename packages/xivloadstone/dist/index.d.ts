export interface CharacterDetails {
    name: string;
    world: string;
    avatarUrl: string;
    dataCenter: string;
    portraitUrl: string;
}
export declare const getCharFromName: (name: string, world: string) => Promise<CharacterDetails>;
export declare const getCharFromID: (id: string) => Promise<CharacterDetails>;
