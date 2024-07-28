# vite-plugin-build-const

Vite plugin to use build-time constants in your code.

Create a file ending with `.const.js` and import it in your code and all the exports will be evaluated at build time and replaced with their values.

Uses [devalue](https://github.com/Rich-Harris/devalue) under the hood.

## Example Usage

#### `vite.config.ts`
```ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import buildConst from "@sexnine/vite-plugin-build-const";

export default defineConfig({
    plugins: [
        sveltekit(),
        buildConst(),
    ],
});
```

#### `src/lib/build-info.const.js`
```js
// All of this code will be run once at build time and replaced with their resulting values
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const prod = process.env.NODE_ENV === "production";

export const commitHash = prod ? execSync("git rev-parse HEAD").toString().trim() : "dev";
export const buildDate = new Date();
export const packageVersion =
    JSON.parse(readFileSync("package.json").toString()).version ?? "unknown";
```

#### `src/routes/+page.svelte`
```sveltehtml
<script lang="ts">
    import { commitHash, buildDate, packageVersion } from "$lib/build-info.const";
</script>

<p>commit hash: {commitHash}</p>
<p>build date: {buildDate.toLocaleString()}</p>
<p>package version: {packageVersion}</p>
```