import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

// Pin the workspace root to this package. Without it Next can infer a stray
// lockfile elsewhere on the machine as the root.
const nextConfig: NextConfig = {
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
};

export default nextConfig;
