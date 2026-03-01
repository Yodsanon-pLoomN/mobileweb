import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, 
  IonButton, IonItem, IonList, IonBackButton, IonButtons,
  useIonAlert // เพิ่มตัวนี้สำหรับกล่องยืนยัน
} from '@ionic/react';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; // เพิ่ม deleteDoc
import { db } from "../firebase";
import { useHistory, useParams } from "react-router-dom";

const EditExpense: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [presentAlert] = useIonAlert(); // ประกาศใช้งาน Alert

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<string>("expense");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "expenses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setAmount(data.amount);
        setType(data.type);
        setCategory(data.category);
        setNote(data.note);
      }
    };
    fetchData();
  }, [id]);

  // ฟังก์ชันอัปเดตข้อมูล (ขั้นตอนที่ 5)
  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        title: title,
        amount: Number(amount),
        type: type,
        category: category,
        note: note
      });
      history.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // ฟังก์ชันลบข้อมูล (ขั้นตอนที่ 6)
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await deleteDoc(docRef);
      history.goBack(); // ลบเสร็จแล้วกลับหน้ารายการ
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // ฟังก์ชันเรียกกล่องยืนยันก่อนลบ
  const confirmDelete = () => {
    presentAlert({
      header: 'ยืนยันการลบข้อมูล?',
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? ข้อมูลจะหายไปถาวร',
      buttons: [
        { text: 'ยกเลิก', role: 'cancel' },
        { text: 'ลบข้อมูล', role: 'confirm', handler: handleDelete }
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>แก้ไข/ลบข้อมูล</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput label="ชื่อรายการ" labelPlacement="floating" value={title} onIonInput={(e) => setTitle(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonInput label="จำนวนเงิน" type="number" labelPlacement="floating" value={amount} onIonInput={(e) => setAmount(Number(e.detail.value!))} />
          </IonItem>
          <IonItem>
            <IonSelect label="ประเภท" value={type} onIonChange={(e) => setType(e.detail.value)}>
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput label="หมวดหมู่" labelPlacement="floating" value={category} onIonInput={(e) => setCategory(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonTextarea label="หมายเหตุ" labelPlacement="floating" value={note} onIonInput={(e) => setNote(e.detail.value!)} />
          </IonItem>
        </IonList>

        <IonButton expand="block" color="primary" onClick={handleUpdate}>
          อัปเดตข้อมูล
        </IonButton>

        {/* ปุ่มลบข้อมูล (ขั้นตอนที่ 6) */}
        <IonButton expand="block" color="danger" fill="outline" className="ion-margin-top" onClick={confirmDelete}>
          ลบข้อมูลรายการนี้
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;