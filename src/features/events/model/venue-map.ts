// Google Maps link built from the address (the documented "search" URL: no
// API key, opens the app on phones), so nobody has to copy it by hand.

type AddressParts = {
  name: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
};

/** null while the address is too thin to find the place. */
export function mapsSearchUrl(address: AddressParts): string | null {
  const street = address.street.trim();
  const city = address.city.trim();
  if (!city) return null;
  const place = [city, address.state.trim()].filter(Boolean).join(" - ");
  let query: string;
  if (street) {
    const number = address.number.trim();
    query = [
      number && number !== "S/N" ? `${street}, ${number}` : street,
      address.district.trim(),
      place,
      address.zipCode.trim(),
    ]
      .filter(Boolean)
      .join(", ");
  } else if (address.name.trim().length >= 2) {
    // No street (a square, a known building): the name finds it.
    query = `${address.name.trim()}, ${place}`;
  } else {
    return null;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type SavedVenue = {
  name: string;
  mapsUrl: string | null;
  street: string | null;
  number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
};

/** The venue's own link, or one made from its address. */
export const venueMapUrl = (venue: SavedVenue): string | null =>
  venue.mapsUrl ??
  mapsSearchUrl({
    name: venue.name,
    street: venue.street ?? "",
    number: venue.number ?? "",
    district: venue.district ?? "",
    city: venue.city ?? "",
    state: venue.state ?? "",
    zipCode: venue.zipCode ?? "",
  });
