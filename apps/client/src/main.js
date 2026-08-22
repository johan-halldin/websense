import "@websense/ui/src/icons/icons.css";
import "@websense/ui/src/tokens.css";
import { init_app } from "./app/app.jc.js";

const root = document.getElementById("root");
if (root === null) {
  throw new Error("Missing #root element");
}
init_app(root);
