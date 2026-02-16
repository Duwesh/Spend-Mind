import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": {},
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // LangChain/LangGraph polyfills for browser
        "node:async_hooks": path.resolve(
          __dirname,
          "./src/lib/polyfills/async_hooks.stub.js",
        ),
      },
    },
    base: mode === "production" ? "/Spend-Mind/" : "/",
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
    },
  };
});
