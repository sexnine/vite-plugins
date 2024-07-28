import { uneval } from "devalue";
import type { Plugin } from "vite";

export interface Config {
  /**
   * The file extensions to transform.  Only JavaScript files are supported.
   * @default ".const.js"
   */
  extension?: string;
}

const transformModule = (module: Record<string, unknown>) =>
  Object.keys(module)
    .map((key) => `export const ${key} = ${uneval(module[key])};`)
    .join("\n");

const plugin = (config: Config = {}) => {
  const transformedCache = new Map<string, string>();

  return {
    name: "vite-plugin-build-const",
    async load(id: string) {
      if (id.endsWith(config.extension ?? ".const.js")) {
        const cached = transformedCache.get(id);
        if (cached) {
          return cached;
        }

        const module = await import(`file:///${id}`);
        const transformed = transformModule(module);

        transformedCache.set(id, transformed);

        return transformed;
      }
    },
  } satisfies Plugin;
};

export default plugin;
