export interface Character {
    name: string;
    world: string;
}
export declare const verifyCharacter: (_key: string, charURI: string) => Promise<Character>;
