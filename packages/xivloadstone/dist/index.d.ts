export interface CharacterDetails {
    name: string;
    world: string;
    avatarUrl: string;
    dataCenter: string;
    portraitUrl: string;
}
export declare const getCharacter: (id: string) => Promise<CharacterDetails>;
