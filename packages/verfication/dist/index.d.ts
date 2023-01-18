export interface VerifyCache {
    cache: Cache;
    duration?: number;
}
export interface Cache {
    bio: string;
    character: string;
}
export declare const vCache: VerifyCache[];
export declare const verifyCharacter: (_key: string, charURI: string) => Promise<void>;
