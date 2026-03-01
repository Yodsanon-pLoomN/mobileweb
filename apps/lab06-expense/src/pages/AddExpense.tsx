import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, 
  IonButton, IonItem, IonList, IonBackButton, IonButtons 
} from '@ionic/react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // ตรวจสอบว่าไฟล์ firebase.ts อยู่ใน src/ หรือไม่
import { useHistory } from "react-router-dom";

const AddExpense: React.FC = () => {
  const history = useHistory();

  // สร้าง State สำหรับเก็บค่าจากฟอร์ม
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("expense");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const saveExpense = async () => {
    try {
      if (!title || amount <= 0) {
        alert("กรุณากรอกชื่อรายการและจำนวนเงินให้ถูกต้อง");
        return;
      }

      await addDoc(collection(db, "expenses"), {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note,
        createdAt: new Date()
      });

      // ล้างค่าฟอร์มหลังบันทึก
      setTitle("");
      setAmount(0);
      setCategory("");
      setNote("");

      // กลับไปหน้ารายการหลัก
      history.push("/tabs/tab1"); 
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab1" />
          </IonButtons>
          <IonTitle>เพิ่มรายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput 
              label="ชื่อรายการ" 
              labelPlacement="floating" 
              value={title} 
              onIonInput={(e) => setTitle(e.detail.value!)} 
            />
          </IonItem>

          <IonItem>
            <IonInput 
              label="จำนวนเงิน" 
              type="number" 
              labelPlacement="floating" 
              value={amount} 
              onIonInput={(e) => setAmount(Number(e.detail.value!))} 
            />
          </IonItem>

          <IonItem>
            <IonSelect 
              label="ประเภท" 
              value={type} 
              onIonChange={(e) => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput 
              label="หมวดหมู่" 
              labelPlacement="floating" 
              value={category} 
              onIonInput={(e) => setCategory(e.detail.value!)} 
            />
          </IonItem>

          <IonItem>
            <IonTextarea 
              label="หมายเหตุ" 
              labelPlacement="floating" 
              value={note} 
              onIonInput={(e) => setNote(e.detail.value!)} 
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" className="ion-margin-top" onClick={saveExpense}>
          บันทึกข้อมูลลง Firestore
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense;