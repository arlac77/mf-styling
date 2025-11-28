import { defineConfig } from "vite";
import { resolve } from "node:path";
import { readdir } from "node:fs/promises";
import { compression } from "vite-plugin-compression2";
import { extractFromPackage } from "npm-pkgbuild";

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

  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  const entries = (
    await readdir(new URL("./tests/app", import.meta.url).pathname)
  ).filter(n => n.match(/.html/));

  return {
    publicDir: "../../src",
    base,
    root: "tests/app",
    /*plugins: [
      compression({
        algorithms: ["brotliCompress"],
        exclude: [
          /\.(map)$/,
          /\.(br)$/,
          /\.(gz)$/,
          /\.(png)$/,
          /\.(jpg)$/,
          /\.(gif)$/,
          /\.(webp)$/,
          /\.(heic)$/,
          /\.(avif)$/,
          /\.(jxl)$/,
          /\.(pdf)$/,
          /\.(docx)$/
        ],
        threshold: 500
      })
    ],*/
    build: {
      rollupOptions: {
        input: {
          ...Object.fromEntries(
            entries.map(e => [e, resolve(__dirname, `tests/app/${e}`)])
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
