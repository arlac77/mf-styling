import { defineConfig } from "vite";
import { extractFromPackage } from "npm-pkgbuild";
import { resolve } from "path";

export default defineConfig(async ({ command, mode }) => {
  const res = extractFromPackage(
    {
      dir: new URL("./", import.meta.url).pathname,
      mode
    },
    process.env
  );
  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = properties["http.path"];
  const production = mode === "production";

  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  const entries = [
    "card",
    "color",
    "form",
    "index",
    "modal",
    "other",
    "tab",
    "table",
    "table-header",
    "topnav"
  ];

  return {
    publicDir: "../../src",
    base,

    root: "tests/app",
    build: {
      rollupOptions: {
        input: {
          ...Object.fromEntries(
            entries.map(e => [e, resolve(__dirname, `tests/app/${e}.html`)])
          )
        }
      },

      outDir: "../../build",
      target: "esnext",
      emptyOutDir: true,
      minify: true,
      sourcemap: true
    },
    server: { host: true }
  };
});
