import { defineConfig } from "vite";

export default defineConfig(async ({ command, mode }) => {
  return {
    publicDir: "../..",
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
