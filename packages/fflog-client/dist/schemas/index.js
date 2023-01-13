"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterEncounterQuery = exports.CharacterZoneQuery = void 0;
exports.CharacterZoneQuery = `
    query getCharZoneData($name: String, $slug: String, $region: String) {
        characterData {
            character(id: null, name: $name, serverSlug: $slug, serverRegion: $region) {
                zoneRankings
            }
        }
    }
`;
exports.CharacterEncounterQuery = `
    query getCharEncounterData($name: String, $slug: String, $region: String, $encounter: Int) {
        characterData {
            character(id: null, name: $name, serverSlug: $slug, serverRegion: $region) {
                encounterRankings(encounterID: $encounter)
            }
        }
    }
`;
