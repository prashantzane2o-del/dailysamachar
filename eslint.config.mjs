// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // FSD Architectural Boundary Enforcement
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message: "Please use lodash-es for better tree-shaking.",
            },
          ],
          patterns: [
            {
              group: ["@/app/*", "@/app/**"],
              message:
                "FSD Violation: You cannot import from the App layer into lower layers. Pass data via props instead.",
            },
            {
              group: ["@/widgets/*", "@/widgets/**"],
              message: "FSD Violation: Entities, Features, or Shared layers cannot import from Widgets.",
            },
            {
              group: ["@/features/*", "@/features/**"],
              message: "FSD Violation: Entities or Shared layers cannot import from Features.",
            },
            {
              group: ["@/entities/*", "@/entities/**"],
              message: "FSD Violation: Shared layer cannot import from Entities.",
            },
          ],
        },
      ],
    },
  },
  {
    // Override: Allow App layer to import from anywhere
    files: ["src/app/**"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    // Override: Allow Widgets to import from Features, Entities, Shared
    files: ["src/widgets/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/app/**"],
              message: "FSD Violation: Widgets cannot import from the App layer.",
            },
          ],
        },
      ],
    },
  },
  {
    // Override: Allow Features to import from Entities and Shared
    files: ["src/features/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/app/**", "@/widgets/*", "@/widgets/**"],
              message: "FSD Violation: Features cannot import from App or Widgets.",
            },
          ],
        },
      ],
    },
  },
];
