/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizeCss: false,
  },
  webpack: (config, { dev }) => {
    if (!dev && process.env.NEXT_DEBUG_MINIMIZERS === '1') {
      const minimizers = Array.isArray(config.optimization?.minimizer) ? config.optimization.minimizer : [];
      const plugins = Array.isArray(config.plugins) ? config.plugins : [];
      console.log('[next-config] minimizers:',
        minimizers.map((m) => ({
          type: m?.constructor?.name || typeof m,
          name: typeof m === 'function' ? m.name : undefined,
          snippet: String(m).slice(0, 140).replace(/\s+/g, ' '),
        }))
      );
      console.log('[next-config] plugins:',
        plugins.map((p) => ({
          type: p?.constructor?.name || typeof p,
          name: typeof p === 'function' ? p.name : undefined,
        }))
      );
    }
    if (!dev && Array.isArray(config.optimization?.minimizer)) {
      config.optimization.minimizer = config.optimization.minimizer.filter((minimizer) => {
        if (minimizer?.constructor?.name === 'CssMinimizerPlugin') return false;
        if (typeof minimizer === 'function') {
          const src = String(minimizer);
          if (src.includes('css-minimizer-plugin') || src.includes('CssMinimizerPlugin')) return false;
        }
        return true;
      });
    }
    if (!dev && Array.isArray(config.plugins)) {
      config.plugins = config.plugins.filter((plugin) => plugin?.constructor?.name !== 'CssMinimizerPlugin');
    }
    return config;
  },
};

export default nextConfig;
