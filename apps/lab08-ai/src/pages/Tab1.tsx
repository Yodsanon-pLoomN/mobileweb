import React, { useRef, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { PhotoService } from '../core/photo.service';
import { GeminiVisionService } from '../core/gemini.service';
import type { Base64Image, ImageAnalysisResult } from '../core/ai.interface';

const Tab1: React.FC = () => {
  // สร้าง Ref สำหรับอ้างอิงถึง input file
  const fileEl = useRef<HTMLInputElement>(null);

  // เปลี่ยนจาก ref() ของ Vue มาใช้ useState() ของ React
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // ฟังก์ชันเลือกไฟล์
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64Image = await PhotoService.fromFile(file);
    setImg(base64Image);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  };

  // ฟังก์ชันถ่ายภาพ
  const onTakePhoto = async () => {
    setLoading(true);
    try {
      const b64 = await PhotoService.fromCamera();
      setImg(b64);
      setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
      setResult(null);
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันวิเคราะห์ภาพ
  const onAnalyze = async () => {
    if (!img) return;
    
    setLoading(true);
    try {
      const analysisResult = await GeminiVisionService.analyze(img);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lab08: Gemini Vision โดย ยศนนท์ ดวงไข</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Input ซ่อนไว้สำหรับเลือกไฟล์ภาพ */}
        <input
          ref={fileEl}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
        />

        <IonButton expand="block" onClick={() => fileEl.current?.click()}>
          เลือกไฟล์ภาพ
        </IonButton>
        <IonButton expand="block" onClick={onTakePhoto}>
          ถ่ายภาพ (Camera)
        </IonButton>

        {/* แทนที่ v-if ด้วยเงื่อนไข && ใน JSX */}
        {previewUrl && <IonImg src={previewUrl} />}

        <IonButton
          expand="block"
          disabled={!img || loading}
          onClick={onAnalyze}
        >
          วิเคราะห์ภาพ
        </IonButton>

        {loading && <IonSpinner />}
        
        {result && (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;