import tailwindTypography from "@tailwindcss/typography";
import tailwindDarkAware from "tailwind-dark-aware";
import { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./{app,components}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { main: colors.zinc },
    },
  },
  plugins: [tailwindDarkAware, tailwindTypography],
} satisfies Config;
