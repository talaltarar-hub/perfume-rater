import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scentify.app',
  appName: 'Scentify',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#1e1e1e',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e1e1e',
    },
  },
};

export default config;

// For development with live reload:
// Uncomment the server config below and run: pnpm dev
// Then build with: pnpm build && pnpm exec cap sync
// const devConfig: CapacitorConfig = {
//   ...config,
//   server: {
//     url: 'http://localhost:5173',
//     cleartext: true,
//   },
// };
// export default process.env.NODE_ENV === 'development' ? devConfig : config;
