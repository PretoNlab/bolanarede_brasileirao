import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bolanarede.manager',
  appName: 'Bolanarede Manager',
  webDir: 'dist', // Alterado para dist para usar a build do Vite
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    }
  }
};

export default config;