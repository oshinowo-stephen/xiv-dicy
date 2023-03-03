export const mapDCToRegion = (dc: string): string => {
    switch(dc.toLowerCase()) {
        case 'aether':
        case 'primal':
        case 'crystal':
        case 'dynamis':
            return 'na'
        default:
            return 'na'
    }
}