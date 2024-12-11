import { GeocodingResult } from "@/types/location";

export async function getCoordinates(
  locationName: string
): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationName
      )}&format=json&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "ReactNativeApp/1.0",
        },
      }
    );
    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
