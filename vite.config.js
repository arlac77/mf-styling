import { defineConfig } from "vite";

export default defineConfig(async ({ command, mode }) => {
  const { extractFromPackage } = await import(
    new URL("node_modules/npm-pkgbuild/src/module.mjs", import.meta.url)
  );
  const res = extractFromPackage({
    dir: new URL("./", import.meta.url).pathname
  });
  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = properties["http.path"] + "/";
  const production = mode === "production";

  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  const open = process.env.CI ? {} : { open: base };

  return {
   // appType: "mpa",
    publicDir: "../../src",
    // base,

    root: "tests/app",
    build: {
      outDir: "../../build",
      target: "esnext",
      emptyOutDir: true,
      minify: true,
      sourcemap: true
    },
    server: { host: true, ...open }
  };
});
