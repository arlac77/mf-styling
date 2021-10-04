import { defineConfig } from "vite";

export default defineConfig(async ({ command, mode }) => {
  return {
    root: "tests/app"
  };
});
