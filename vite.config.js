import { readFile } from "fs/promises";
import { defineConfig } from "vite";

export default defineConfig(async ({ command, mode }) => {
  const json = JSON.parse(
    await readFile(new URL("package.json", import.meta.url).pathname, {
      encoding: "utf8"
    })
  );
  const base = json.pkg["http.base.path"].replace(/\$\{name\}/, json.name) + "/";

  return {
    publicDir: "../../src",
    base,

    root: "tests/app",
    build: {
      outDir: "../../build",
      target: "esnext",
      emptyOutDir: true,
      minify: true,
      sourcemap: true
    }
  };
});
