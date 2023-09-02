import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default defineConfig({
  /* @twind/with-web-components will use
   * hashed class names in production by default
   * If you don't want this, uncomment the next line
   */
  // hash: false,
  presets: [presetAutoprefix(), presetTailwind()],
});
