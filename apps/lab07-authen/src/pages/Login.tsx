import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonInput, IonButton, IonIcon, IonText } from '@ionic/react';
import { mailOutline, logoGoogle, callOutline } from 'ionicons/icons';
import { authService } from '../auth/auth-service';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginEmail = async () => {
    try {
      await authService.loginWithEmailPassword({ email, password });
      window.location.href = "/tabs/tab1"; // รีโหลดเพื่อให้ App.tsx เช็ค Auth ใหม่
    } catch (err) { alert("Email Login Failed"); }
  };

const loginGoogle = async () => {
    try {
      await authService.loginWithGoogle();
      window.location.href = "/tabs/tab1";
    } catch (err: any) { 
      // แก้ตรงนี้! ให้มันปริ้นท์ข้อความ Error จริงๆ ออกมาดู
      alert("Google Login Failed: " + err.message); 
      console.error("รายละเอียด Error:", err);
    }
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>เข้าสู่ระบบ</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput label="อีเมล" labelPlacement="floating" onIonInput={(e) => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonInput label="รหัสผ่าน" type="password" labelPlacement="floating" onIonInput={(e) => setPassword(e.detail.value!)} />
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={loginEmail}>
          <IonIcon slot="start" icon={mailOutline} /> เข้าด้วย Email
        </IonButton>

        <div className="ion-padding-vertical ion-text-center"><IonText>หรือ</IonText></div>

        <IonButton expand="block" color="danger" onClick={loginGoogle}>
          <IonIcon slot="start" icon={logoGoogle} /> เข้าด้วย Google
        </IonButton>

        <IonButton expand="block" color="success" routerLink="/login-phone">
          <IonIcon slot="start" icon={callOutline} /> เข้าด้วยเบอร์โทรศัพท์
        </IonButton>
        
        {/* สำหรับ Web Phone Login ต้องมี div นี้ */}
        <div id="recaptcha-container"></div>
      </IonContent>
    </IonPage>
  );
};

export default Login;