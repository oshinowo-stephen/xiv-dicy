"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterZoneQuery = void 0;
exports.CharacterZoneQuery = `
    query getCharZoneData($name: String, $slug: String, $region: String) {
        characterData {
            character(id: null, name: $name, serverSlug: $slug, serverRegion: $region) {
                zoneRankings
            }
        }
    }
`;
