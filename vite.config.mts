import { defineConfig } from "vite";
import { glob } from "node:fs/promises";
import { fileURLToPath } from "node:url";
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

  let input = {};

  for await (const app of glob(
    fileURLToPath(new URL("./tests/app/*.html", import.meta.url))
  )) {
    input["tests/app/" + app.match(/app\/(.*)\.html/)[1]] = app;
  }

  // console.log(input);

  return {
    base,
    plugins: [
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
    ],
    build: {
      rollupOptions: {
        input
      },
      outDir: "build",
      target: "esnext",
      emptyOutDir: true,
      minify: true,
      sourcemap: true
    },
    server: { host: true }
  };
});
