export type Timeouts = Set<string>;
export declare const timeouts: Timeouts;
export declare function createTimeout(value: string, seconds: number): void;
export declare function deleteTimeout(value: string): void;
export declare const randomString: (length: number) => string;
export declare const sleep: (ms: number) => Promise<unknown>;
