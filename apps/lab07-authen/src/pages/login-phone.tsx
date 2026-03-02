import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonButton, IonItem, IonList, IonButtons, 
  IonBackButton, IonText, IonLoading
} from '@ionic/react';
import { authService } from '../auth/auth-service';

const LoginPhone: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1 = กรอกเบอร์, Step 2 = กรอก OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันแปลงเบอร์โทรไทย (08X...) ให้เป็นรูปแบบ E.164 (+668X...)
  const formatPhoneNumber = (phone: string) => {
    if (phone.startsWith('0')) {
      return '+66' + phone.substring(1);
    }
    return phone;
  };

  // ขั้นตอนที่ 1: ขอรับรหัส OTP
  const handleSendCode = async () => {
    if (!phoneNumber) return alert('กรุณากรอกเบอร์โทรศัพท์');
    
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      // เรียกใช้ Service ที่เราเขียนไว้
      const result = await authService.startPhoneLogin({ phoneNumberE164: formattedPhone });
      
      setVerificationId(result.verificationId);
      setStep(2); // เปลี่ยนไปหน้าจอให้กรอก OTP
    } catch (error: any) {
      console.error(error);
      alert('ส่งรหัส OTP ไม่สำเร็จ: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ขั้นตอนที่ 2: ยืนยันรหัส OTP
  const handleVerifyCode = async () => {
    if (!verificationCode) return alert('กรุณากรอกรหัส OTP');

    setIsLoading(true);
    try {
      await authService.confirmPhoneCode({ verificationId, verificationCode });
      // ถ้ายืนยันสำเร็จ ให้เด้งไปหน้า Tab1 (บังคับโหลดใหม่ให้ App.tsx เช็ค Auth)
      window.location.href = '/tabs/tab1';
    } catch (error: any) {
      console.error(error);
      alert('รหัส OTP ไม่ถูกต้อง: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>เข้าสู่ระบบด้วยเบอร์โทร</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} message="กำลังดำเนินการ..." />

        {/* --- ส่วนที่ 1: กรอกเบอร์โทรศัพท์ --- */}
        {step === 1 && (
          <>
            <div className="ion-text-center ion-margin-bottom">
              <IonText color="medium">
                <p>กรุณากรอกเบอร์โทรศัพท์ของคุณ</p>
                <p>(เช่น 0812345678 ระบบจะแปลงเป็น +66 อัตโนมัติ)</p>
              </IonText>
            </div>
            <IonList>
              <IonItem>
                <IonInput
                  type="tel"
                  label="เบอร์โทรศัพท์"
                  labelPlacement="floating"
                  value={phoneNumber}
                  onIonInput={e => setPhoneNumber(e.detail.value!)}
                  placeholder="08xxxxxxxx"
                />
              </IonItem>
            </IonList>

            <IonButton expand="block" className="ion-margin-top" onClick={handleSendCode}>
              ขอรับรหัส OTP
            </IonButton>

            {/* ⚠️ สำคัญมากสำหรับ Web: ต้องมี div นี้ให้ Firebase เอา reCAPTCHA มาวาง */}
            <div id="recaptcha-container" className="ion-margin-top ion-text-center"></div>
          </>
        )}

        {/* --- ส่วนที่ 2: กรอกรหัส OTP --- */}
        {step === 2 && (
          <>
            <div className="ion-text-center ion-margin-bottom">
              <IonText color="medium">
                <p>ระบบได้ส่งรหัส OTP ไปที่ {formatPhoneNumber(phoneNumber)} แล้ว</p>
              </IonText>
            </div>
            <IonList>
              <IonItem>
                <IonInput
                  type="number"
                  label="รหัส OTP 6 หลัก"
                  labelPlacement="floating"
                  value={verificationCode}
                  onIonInput={e => setVerificationCode(e.detail.value!)}
                  placeholder="123456"
                />
              </IonItem>
            </IonList>

            <IonButton expand="block" color="success" className="ion-margin-top" onClick={handleVerifyCode}>
              ยืนยันรหัส OTP
            </IonButton>

            <IonButton expand="block" fill="clear" color="medium" onClick={() => setStep(1)}>
              เปลี่ยนเบอร์โทรศัพท์
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LoginPhone;