import { init_app } from "./app/app.jc.js";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("Missing #root element");
}
init_app(root);
