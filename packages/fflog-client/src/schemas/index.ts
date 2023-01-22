export const CharacterZoneQuery = `
    query getCharZoneData($name: String, $slug: String, $region: String) {
        characterData {
            character(id: null, name: $name, serverSlug: $slug, serverRegion: $region) {
                zoneRankings
            }
        }
    }
`
