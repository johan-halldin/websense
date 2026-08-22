import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgDir = join(__dirname, "svg");
const fileNames = readdirSync(svgDir).filter((name) => name.endsWith(".svg"));

/** @type {string[]} */
const names = [];
/** @type {string[]} */
const rootVarLines = [];
/** @type {string[]} */
const classRules = [];

for (const fileName of fileNames) {
  const name = fileName.slice(0, -".svg".length);
  const svg = readFileSync(join(svgDir, fileName), "utf8");
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  rootVarLines.push(`  --icon-${name}: url("${dataUrl}");`);
  classRules.push(`.icon.${name} {
  mask-image: var(--icon-${name});
  -webkit-mask-image: var(--icon-${name});
}`);
  names.push(name);
}
names.sort();
rootVarLines.sort();

// Icons are exposed as CSS custom properties (not just the .icon.<name> class
// below) because custom properties inherit through shadow DOM boundaries and
// classes don't - components rendering inside a shadow root reference
// var(--icon-<name>) directly instead of relying on the class.
const cssRules = [
  `:root {\n${rootVarLines.join("\n")}\n}`,
  `.icon {
  display: inline-block;
  width: calc(var(--icon-scale, 1) * 16px);
  height: calc(var(--icon-scale, 1) * 16px);
  background-color: var(--icon-color, currentColor);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}`,
  ...classRules,
];

writeFileSync(join(__dirname, "icons.css"), `${cssRules.join("\n\n")}\n`);

const typedefLines = [
  "/**",
  ` * @typedef {"${names[0]}"`,
  ...names.slice(1).map((name) => ` * |"${name}"`),
  " * } IconName",
  " */",
  "",
  "export {};",
  "",
];
writeFileSync(join(__dirname, "icon-types.js"), typedefLines.join("\n"));

const exampleHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Icons</title>
    <link rel="stylesheet" href="../tokens.css" />
    <link rel="stylesheet" href="./icons.css" />
    <style>
      body {
        font-family: sans-serif;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        width: 80px;
      }
      .item .icon {
        --icon-scale: 1.5;
        --icon-color: var(--color-text);
      }
      .item span.name {
        font-size: 11px;
        font-family: monospace;
        cursor: pointer;
        border-radius: 3px;
        padding: 1px 3px;
      }
      .item span.name:hover {
        background: var(--color-background);
      }
    </style>
  </head>
  <body>
${names.map((name) => `    <div class="item"><span class="icon ${name}"></span><span class="name" title="Click to copy">${name}</span></div>`).join("\n")}
    <script type="module">
      for (const label of document.querySelectorAll("span.name")) {
        label.addEventListener("click", async () => {
          await navigator.clipboard.writeText(label.textContent);
          const original = label.textContent;
          label.textContent = "Copied!";
          setTimeout(() => {
            label.textContent = original;
          }, 800);
        });
      }
    </script>
  </body>
</html>
`;
writeFileSync(join(__dirname, "icons.example.html"), exampleHtml);

console.log(
  `Generated icons.css, icon-types.js, icons.example.html for ${names.length} icons.`,
);
