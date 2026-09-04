import { createServer } from "node:http";
import { clamp, isPositiveInteger } from "@websense/util";
import {
  handleCreateCity,
  handleDeleteCity,
  handleListCities,
} from "./endpoints/cities.js";
import { handleRouteMeasurements } from "./endpoints/route-measurements.js";
import { handleCorrelations } from "./endpoints/correlations.js";
import { handleIngest } from "./endpoints/ingest.js";
import { handleMesh } from "./endpoints/mesh.js";
import { handleEvents } from "./events.js";
import { sendError, sendJson } from "./http.js";

const PORT = clamp(Number(process.env.PORT) || 3001, 0, 65535);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  const onError = (/** @type {unknown} */ error) => {
    console.error(error);
    sendError(res, 500, "Internal server error");
  };

  if (url.pathname === "/api/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (url.pathname === "/api/route-summaries" && req.method === "GET") {
    handleMesh(res).catch(onError);
    return;
  }

  if (url.pathname === "/api/events") {
    handleEvents(res);
    return;
  }

  if (url.pathname === "/api/ingest" && req.method === "POST") {
    handleIngest(res).catch(onError);
    return;
  }

  if (url.pathname === "/api/route-correlations" && req.method === "GET") {
    handleCorrelations(url.searchParams, res).catch(onError);
    return;
  }

  if (url.pathname === "/api/cities" && req.method === "GET") {
    handleListCities(res).catch(onError);
    return;
  }

  if (url.pathname === "/api/cities" && req.method === "POST") {
    handleCreateCity(req, res).catch(onError);
    return;
  }

  const routeMeasurementsMatch = url.pathname.match(
    /^\/api\/routes\/(\d+)\/(\d+)\/measurements$/,
  );
  if (routeMeasurementsMatch && req.method === "GET") {
    const srcId = Number(routeMeasurementsMatch[1]);
    const dstId = Number(routeMeasurementsMatch[2]);
    handleRouteMeasurements(srcId, dstId, url.searchParams, res).catch(onError);
    return;
  }

  const cityIdMatch = url.pathname.match(/^\/api\/cities\/(\d+)$/);
  if (cityIdMatch && req.method === "DELETE") {
    const cityIdText = cityIdMatch[1];
    if (cityIdText !== undefined) {
      const cityId = Number(cityIdText);
      if (isPositiveInteger(cityId)) {
        handleDeleteCity(cityId, res).catch(onError);
        return;
      }
    }
  }

  sendError(res, 404, "Not found");
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
