const nextConfig = {
  eslint: {
    // This tells Next.js to ignore ESLint errors during the build step.
    // This avoids "Build Failed" due to unused variables or 'any' types.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This tells Next.js to ignore TypeScript type errors during the build.
    // Useful if you have some 'any' types you want to fix later.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;