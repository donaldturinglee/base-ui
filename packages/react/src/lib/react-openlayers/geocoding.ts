import type { MapSearchResult } from "./types";

// Nominatim is OpenStreetMap's own geocoder, the one the tiles a map is drawn from come from, so
// a map given nothing further can still name where it is pointed and find somewhere by name.
// It is asked over the network and answers slowly, so nothing here is on a drawing path
const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

// How closely an address is read off a pair of coordinates. Eighteen is a building; further out
// gives a street, a suburb, a town, in turn
const DEFAULT_ADDRESS_ZOOM = 18;

const DEFAULT_SEARCH_LIMIT = 10;
const DEFAULT_LANGUAGE = "en-US";

// Whatever was left out is dropped rather than sent along as the word "undefined"
const serialize = (params: Record<string, string | number | undefined>) => {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            search.set(key, String(value));
        }
    }

    return search.toString();
};

// What stands at a pair of coordinates, written out as one line. Somewhere with no address to
// give back comes back empty rather than throwing, since a popup with a blank line in it is
// better than a popup that never opened
export async function getAddress(
    lon: number,
    lat: number,
    zoom: number = DEFAULT_ADDRESS_ZOOM,
    language: string = DEFAULT_LANGUAGE,
): Promise<string> {
    const params = serialize({
        lat,
        lon,
        zoom,
        addressdetails: 1,
        format: "json",
        "accept-language": language,
    });

    const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`);
    const result = (await response.json()) as { display_name?: string };

    return result.display_name ?? "";
}

// Where somewhere named might be, most likely first. The coordinates come back written out
// rather than as numbers, which is the geocoder's own doing rather than anything read here
export async function getLonLat(
    query: string,
    limit: number = DEFAULT_SEARCH_LIMIT,
    countryCodes: string = "",
    language: string = DEFAULT_LANGUAGE,
): Promise<MapSearchResult[]> {
    const params = serialize({
        q: query,
        limit,
        countrycodes: countryCodes,
        addressdetails: 1,
        format: "json",
        "accept-language": language,
    });

    const response = await fetch(`${NOMINATIM_URL}/search?${params}`);

    return (await response.json()) as MapSearchResult[];
}
