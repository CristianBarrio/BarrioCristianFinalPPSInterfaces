import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Competencia de Música',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: "none",
      resizeOnFullScreen: false
    }
  }
};

export default config;
