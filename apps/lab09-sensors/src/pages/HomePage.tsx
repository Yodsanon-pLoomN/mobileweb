import React, { useEffect, useMemo, useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonCard, IonCardContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

export const HomePage: React.FC = () => {
  const [state, setState] = useState<WorkoutState | null>(null);

  const motion = useMemo(() => new MotionService(), []);
  const tts = useMemo(() => new TtsService(), []);
  const haptic = useMemo(() => new HapticsService(), []);
  // ส่งมอบ tts และ haptic ให้ Engine นำไปใช้
  const engine = useMemo(() => new ArmWorkoutEngine(tts, haptic), [tts, haptic]);

  useEffect(() => {
    engine.onChange(setState);
  }, [engine]);
  const start = async () => {
    await tts.speak("เริ่มกายบริหารแขน แขนแนบลำตัว ยกขึ้นจนสุดแล้วลดลง");
    engine.start();
    await motion.start((s) => engine.process(s));
  };

  const stop = async () => {
    await motion.stop();
    engine.stop();
    await tts.speak("สิ้นสุดการออกกำลังกาย");
  };

  // คำนวณเปอร์เซ็นต์ความถูกต้อง
  const percentOk = state && state.stats.repsTotal > 0 
    ? Math.round((state.stats.repsOk / state.stats.repsTotal) * 100) 
    : 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>กายบริหารแขน (Sensors)</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="ion-text-center">
          <h2>จำนวนครั้งที่ทำได้ (ถูกต้อง)</h2>
          <h1 style={{ fontSize: '6rem', margin: '0', color: '#3880ff' }}>
            {state?.repDisplay ?? 0}
          </h1>
          <p style={{ color: state?.stats.lastMessage === 'OK' ? 'green' : 'red', fontWeight: 'bold' }}>
            {state?.stats.lastMessage === 'OK' ? 'เยี่ยมมาก!' : state?.stats.lastMessage}
          </p>
        </div>

        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol><strong>รอบทั้งหมด:</strong> {state?.stats.repsTotal ?? 0}</IonCol>
                <IonCol><strong>รอบถูก:</strong> <span style={{color: 'green'}}>{state?.stats.repsOk ?? 0}</span></IonCol>
              </IonRow>
              <IonRow>
                <IonCol><strong>รอบผิด:</strong> <span style={{color: 'red'}}>{state?.stats.repsBad ?? 0}</span></IonCol>
                <IonCol><strong>เปอร์เซ็นต์ถูก:</strong> {percentOk}%</IonCol>
              </IonRow>
              <IonRow>
                <IonCol><strong>คะแนน:</strong> {state?.stats.score ?? 0}</IonCol>
                <IonCol><strong>ความเร็วเฉลี่ย:</strong> {state?.stats.avgRepMs ? (state.stats.avgRepMs / 1000).toFixed(2) + ' s' : '0 s'}</IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <div className="ion-margin-top">
          <IonButton expand="block" color="success" onClick={start} disabled={state?.status === 'RUNNING'}>เริ่ม (Start)</IonButton>
          <IonButton expand="block" color="danger" onClick={stop} disabled={state?.status !== 'RUNNING'}>หยุด (Stop)</IonButton>
        </div>
      </IonContent>

      <IonFooter className="ion-padding ion-text-center text-muted">
        663380021-5 นายยศนนท์ ดวงไข
      </IonFooter>
    </IonPage>
  );
};

export default HomePage;