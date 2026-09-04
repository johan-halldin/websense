import { describe, expect, it } from "vitest";
import {
  sanitizeApiCities,
  sanitizeApiCity,
  sanitizeApiCreateCity,
} from "./cities.js";

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
    expect(sanitizeApiCreateCity(createCity)).toEqual(createCity);
  });

  it("rejects invalid city-creation fields", () => {
    expect(sanitizeApiCreateCity({ ...createCity, name: "   " })).toBeNull();
    expect(sanitizeApiCreateCity({ ...createCity, lat: 91 })).toBeNull();
    expect(sanitizeApiCreateCity({ ...createCity, probeId: 0 })).toBeNull();
  });

  it("sanitizes city responses and their lists", () => {
    const city = { id: 18, ...createCity };

    expect(sanitizeApiCity(city)).toEqual(city);
    expect(sanitizeApiCities([city])).toEqual([city]);
    expect(sanitizeApiCities([createCity])).toBeNull();
  });
});
