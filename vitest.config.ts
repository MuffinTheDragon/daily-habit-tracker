import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
