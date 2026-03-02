import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonAvatar, IonItem, IonLabel, IonButton } from '@ionic/react';
import { authService } from '../auth/auth-service';
import { AuthUser } from '../auth/auth-interface';

const Tab1: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/login";
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar color="primary"><IonTitle>ข้อมูลผู้ใช้</IonTitle></IonToolbar></IonHeader>
      <IonContent>
        {user && (
          <IonCard>
            <IonItem lines="none" className="ion-margin-top">
              <IonAvatar slot="start">
                <img src={user.photoUrl || 'https://ionicframework.com/docs/img/demos/avatar.svg'} />
              </IonAvatar>
              <IonLabel>
                <h2>{user.displayName || 'ไม่มีชื่อแสดง'}</h2>
                <p>{user.email || user.phoneNumber || 'ไม่มีข้อมูลติดต่อ'}</p>
              </IonLabel>
            </IonItem>
            <IonCardContent>
              <p><b>UID:</b> {user.uid}</p>
              <IonButton expand="block" color="light" onClick={handleLogout} className="ion-margin-top">
                ออกจากระบบ
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;