export const CharacterZoneQuery = `
    query getCharZoneData($name: String, $slug: String, $region: String) {
        characterData {
            character(id: null, name: $name, serverSlug: $slug, serverRegion: $region) {
                zoneRankings
            }
        }
    }
`
export const CharacterEncounterQuery = `
    query getCharEncounterData($name: String, $slug: String, $region: String, $encounter: Int) {
        characterData {
            character(id: null, name: $name, serverSlug: $slug, serverRegion: $region) {
                encounterRankings(encounterID: $encounter)
            }
        }
    }
`