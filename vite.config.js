import { defineConfig } from "vite";

export default defineConfig(async ({ command, mode }) => {
  return {
    publicDir: "../..",
    root: "tests/app"
  };
});
