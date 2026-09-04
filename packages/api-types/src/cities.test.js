import { describe, expect, it } from "vitest";
import { isApiCities, isApiCity, isApiCreateCity } from "./cities.js";

const createCity = {
  name: "Stockholm",
  country: "SE",
  lat: 59.3293,
  lon: 18.0686,
  probeId: 7434,
  measurementId: 84292484,
};

describe("city API contract", () => {
  it("sanitizes a valid city-creation request", () => {
    expect(isApiCreateCity(createCity)).toBe(true);
  });

  it("rejects invalid city-creation fields", () => {
    expect(isApiCreateCity({ ...createCity, name: "   " })).toBe(false);
    expect(isApiCreateCity({ ...createCity, lat: 91 })).toBe(false);
    expect(isApiCreateCity({ ...createCity, probeId: 0 })).toBe(false);
  });

  it("sanitizes city responses and their lists", () => {
    const city = { id: 18, ...createCity };

    expect(isApiCity(city)).toBe(true);
    expect(isApiCities([city])).toBe(true);
    expect(isApiCities([createCity])).toBe(false);
  });
});
