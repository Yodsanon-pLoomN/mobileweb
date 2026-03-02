import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cpkku.Yodsanon.lab07',
  appName: 'lab07-authen',
  webDir: 'dist',


  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      // ประกาศให้ปลั๊กอินรู้ว่าเราจะใช้ Google และ Phone บนมือถือ!
      providers: ['google.com', 'phone', 'password'],
    }
  }


};

export default config;
