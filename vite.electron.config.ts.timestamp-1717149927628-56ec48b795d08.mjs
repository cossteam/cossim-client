// vite.electron.config.ts
import { defineConfig as defineConfig2 } from "file:///Users/macos-13/Desktop/IM/coss-client-new/node_modules/.pnpm/vite@5.2.12_@types+node@20.12.13_sass@1.77.4_terser@5.31.0/node_modules/vite/dist/node/index.js";
import electron from "file:///Users/macos-13/Desktop/IM/coss-client-new/node_modules/.pnpm/vite-plugin-electron@0.28.7_vite-plugin-electron-renderer@0.14.5/node_modules/vite-plugin-electron/dist/simple.mjs";
import path2 from "node:path";

// vite.config.ts
import { defineConfig } from "file:///Users/macos-13/Desktop/IM/coss-client-new/node_modules/.pnpm/vite@5.2.12_@types+node@20.12.13_sass@1.77.4_terser@5.31.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/macos-13/Desktop/IM/coss-client-new/node_modules/.pnpm/@vitejs+plugin-react@4.3.0_vite@5.2.12_@types+node@20.12.13_sass@1.77.4_terser@5.31.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import pages from "file:///Users/macos-13/Desktop/IM/coss-client-new/node_modules/.pnpm/vite-plugin-pages@0.32.2_react-router@6.23.1_react@18.3.1__vite@5.2.12_@types+node@20.12.13_sass@1.77.4_terser@5.31.0_/node_modules/vite-plugin-pages/dist/index.js";
import { Capacitor } from "file:///Users/macos-13/Desktop/IM/coss-client-new/node_modules/.pnpm/@capacitor+core@6.0.0/node_modules/@capacitor/core/dist/index.cjs.js";
var __vite_injected_original_dirname = "/Users/macos-13/Desktop/IM/coss-client-new";
var __IS_WEB__ = Capacitor.getPlatform() === "web";
var __IS_ANDROID__ = Capacitor.getPlatform() === "android";
var __IS_IOS__ = Capacitor.getPlatform() === "ios";
var __IS_NATIVE__ = JSON.stringify(Capacitor.isNativePlatform());
var vite_config_default = defineConfig({
  plugins: [
    react(),
    pages()
    // visualizer({ open: false })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "~": path.resolve(__vite_injected_original_dirname, "./electron")
    }
  },
  define: {
    __IS_ELECTRON__: false,
    __IS_WEB__,
    __IS_ANDROID__,
    __IS_IOS__,
    __IS_NATIVE__
  },
  build: {
    minify: "terser",
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1e3,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]"
      }
    }
  }
});

// vite.electron.config.ts
var __vite_injected_original_dirname2 = "/Users/macos-13/Desktop/IM/coss-client-new";
var ELECTRON_ENTRY = path2.resolve(__vite_injected_original_dirname2, "electron/main/main.ts");
var PRELOAD_INPUT = path2.resolve(__vite_injected_original_dirname2, "electron/preload/preload.ts");
var vite_electron_config_default = defineConfig2({
  ...vite_config_default,
  plugins: [
    ...vite_config_default?.plugins || [],
    electron({
      main: {
        entry: ELECTRON_ENTRY
      },
      preload: {
        input: PRELOAD_INPUT
      },
      renderer: process.env.NODE_ENV === "test" ? void 0 : {}
    })
  ],
  define: {
    ...vite_config_default.define,
    __IS_ELECTRON__: true,
    __IS_WEB__: false
  }
});
export {
  vite_electron_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5lbGVjdHJvbi5jb25maWcudHMiLCAidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjb3MtMTMvRGVza3RvcC9JTS9jb3NzLWNsaWVudC1uZXdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tYWNvcy0xMy9EZXNrdG9wL0lNL2Nvc3MtY2xpZW50LW5ldy92aXRlLmVsZWN0cm9uLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWFjb3MtMTMvRGVza3RvcC9JTS9jb3NzLWNsaWVudC1uZXcvdml0ZS5lbGVjdHJvbi5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGVsZWN0cm9uIGZyb20gJ3ZpdGUtcGx1Z2luLWVsZWN0cm9uL3NpbXBsZSdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBjb25maWcgZnJvbSAnLi92aXRlLmNvbmZpZydcblxuY29uc3QgRUxFQ1RST05fRU5UUlkgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZWxlY3Ryb24vbWFpbi9tYWluLnRzJylcbmNvbnN0IFBSRUxPQURfSU5QVVQgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZWxlY3Ryb24vcHJlbG9hZC9wcmVsb2FkLnRzJylcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICAuLi5jb25maWcsXG4gICAgcGx1Z2luczogW1xuICAgICAgICAuLi4oY29uZmlnPy5wbHVnaW5zIHx8IFtdKSxcbiAgICAgICAgZWxlY3Ryb24oe1xuICAgICAgICAgICAgbWFpbjoge1xuICAgICAgICAgICAgICAgIGVudHJ5OiBFTEVDVFJPTl9FTlRSWVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByZWxvYWQ6IHtcbiAgICAgICAgICAgICAgICBpbnB1dDogUFJFTE9BRF9JTlBVVFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlbmRlcmVyOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Rlc3QnID8gdW5kZWZpbmVkIDoge31cbiAgICAgICAgfSlcbiAgICBdLFxuICAgIGRlZmluZToge1xuICAgICAgICAuLi5jb25maWcuZGVmaW5lLFxuICAgICAgICBfX0lTX0VMRUNUUk9OX186IHRydWUsXG4gICAgICAgIF9fSVNfV0VCX186IGZhbHNlXG4gICAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21hY29zLTEzL0Rlc2t0b3AvSU0vY29zcy1jbGllbnQtbmV3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFjb3MtMTMvRGVza3RvcC9JTS9jb3NzLWNsaWVudC1uZXcvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21hY29zLTEzL0Rlc2t0b3AvSU0vY29zcy1jbGllbnQtbmV3L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBwYWdlcyBmcm9tICd2aXRlLXBsdWdpbi1wYWdlcydcbmltcG9ydCB7IENhcGFjaXRvciB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSdcbi8vIGltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5cbmNvbnN0IF9fSVNfV0VCX18gPSBDYXBhY2l0b3IuZ2V0UGxhdGZvcm0oKSA9PT0gJ3dlYidcbmNvbnN0IF9fSVNfQU5EUk9JRF9fID0gQ2FwYWNpdG9yLmdldFBsYXRmb3JtKCkgPT09ICdhbmRyb2lkJ1xuY29uc3QgX19JU19JT1NfXyA9IENhcGFjaXRvci5nZXRQbGF0Zm9ybSgpID09PSAnaW9zJ1xuY29uc3QgX19JU19OQVRJVkVfXyA9IEpTT04uc3RyaW5naWZ5KENhcGFjaXRvci5pc05hdGl2ZVBsYXRmb3JtKCkpXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHBhZ2VzKClcbiAgICAvLyB2aXN1YWxpemVyKHsgb3BlbjogZmFsc2UgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9lbGVjdHJvbicpXG4gICAgfVxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBfX0lTX0VMRUNUUk9OX186IGZhbHNlLFxuICAgIF9fSVNfV0VCX18sXG4gICAgX19JU19BTkRST0lEX18sXG4gICAgX19JU19JT1NfXyxcbiAgICBfX0lTX05BVElWRV9fXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiBmYWxzZSxcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdbZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJ1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1UsU0FBUyxnQkFBQUEscUJBQW9CO0FBQy9WLE9BQU8sY0FBYztBQUNyQixPQUFPQyxXQUFVOzs7QUNGK1IsU0FBUyxvQkFBb0I7QUFDN1UsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxpQkFBaUI7QUFKMUIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTSxhQUFhLFVBQVUsWUFBWSxNQUFNO0FBQy9DLElBQU0saUJBQWlCLFVBQVUsWUFBWSxNQUFNO0FBQ25ELElBQU0sYUFBYSxVQUFVLFlBQVksTUFBTTtBQUMvQyxJQUFNLGdCQUFnQixLQUFLLFVBQVUsVUFBVSxpQkFBaUIsQ0FBQztBQUVqRSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxFQUVSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLElBQzNDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04saUJBQWlCO0FBQUEsSUFDakI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsSUFDZCxlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU8sR0FBRyxTQUFTLEVBQUUsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTO0FBQUEsVUFDeEU7QUFBQSxRQUNGO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzs7O0FEdERELElBQU1DLG9DQUFtQztBQUt6QyxJQUFNLGlCQUFpQkMsTUFBSyxRQUFRQyxtQ0FBVyx1QkFBdUI7QUFDdEUsSUFBTSxnQkFBZ0JELE1BQUssUUFBUUMsbUNBQVcsNkJBQTZCO0FBRTNFLElBQU8sK0JBQVFDLGNBQWE7QUFBQSxFQUN4QixHQUFHO0FBQUEsRUFDSCxTQUFTO0FBQUEsSUFDTCxHQUFJLHFCQUFRLFdBQVcsQ0FBQztBQUFBLElBQ3hCLFNBQVM7QUFBQSxNQUNMLE1BQU07QUFBQSxRQUNGLE9BQU87QUFBQSxNQUNYO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDTCxPQUFPO0FBQUEsTUFDWDtBQUFBLE1BQ0EsVUFBVSxRQUFRLElBQUksYUFBYSxTQUFTLFNBQVksQ0FBQztBQUFBLElBQzdELENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixHQUFHLG9CQUFPO0FBQUEsSUFDVixpQkFBaUI7QUFBQSxJQUNqQixZQUFZO0FBQUEsRUFDaEI7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJwYXRoIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lIiwgImRlZmluZUNvbmZpZyJdCn0K
