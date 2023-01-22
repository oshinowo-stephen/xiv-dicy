export * from './storage'
export * from './verification'

import { Character } from './storage'

export enum Region {
    NA = 'NA'
}

export const findMain = (characters: Character[]): Character => 
    characters.filter(({ priority }) => priority === 0)[0]

export const getDCRegion = (dc: string): string => { 
    switch (dc.toLowerCase()) {
        case 'primal':
        case 'dynamis':
        case 'crystal':
        case 'aether':
            return Region.NA
        default:
            return Region.NA
    }
}
