import { describe, expect, it } from "vitest";
import { isApiCities, isApiCity } from "./cities.js";

const city = {
  id: 18,
  name: "Stockholm",
  country: "SE",
  lat: 59.3293,
  lon: 18.0686,
  probeId: 7434,
  measurementId: 84292484,
};

describe("city API contract", () => {
  it("sanitizes city responses and their lists", () => {
    expect(isApiCity(city)).toBe(true);
    expect(isApiCities([city])).toBe(true);
    expect(isApiCities([{ ...city, id: undefined }])).toBe(false);
    expect(isApiCities([{ ...city, lat: 91 }])).toBe(false);
  });
});
