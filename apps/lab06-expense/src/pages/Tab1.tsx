import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonList, IonItem, IonLabel, IonNote, IonBadge, IonText, IonGrid, IonRow, IonCol 
} from '@ionic/react';
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const Tab1: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempExpenses: Expense[] = [];
      let income = 0;
      let expense = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data } as Expense;
        tempExpenses.push(item);

        if (item.type === 'income') {
          income += item.amount;
        } else {
          expense += item.amount;
        }
      });

      setExpenses(tempExpenses);
      setTotalIncome(income);
      setTotalExpense(expense);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>รายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* สรุปยอดเงิน */}
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <div style={{ background: '#e7f5eb', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <IonText color="success"><p style={{ margin: 0 }}>รายรับรวม</p></IonText>
                <IonText color="success"><h2 style={{ margin: '5px 0' }}>{totalIncome.toLocaleString()}</h2></IonText>
              </div>
            </IonCol>
            <IonCol size="6">
              <div style={{ background: '#fdecea', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                <IonText color="danger"><p style={{ margin: 0 }}>รายจ่ายรวม</p></IonText>
                <IonText color="danger"><h2 style={{ margin: '5px 0' }}>{totalExpense.toLocaleString()}</h2></IonText>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* รายการรายการ */}
        <IonList inset={true}>
          {expenses.length === 0 ? (
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <IonText color="medium">ยังไม่มีข้อมูลบันทึก</IonText>
             </div>
          ) : (
            expenses.map((item) => (
              /* แก้ไข: เพิ่ม routerLink เพื่อกดไปหน้า Edit ในขั้นตอนที่ 5 */
              <IonItem key={item.id} routerLink={`/edit/${item.id}`} detail={true}>
                <IonLabel>
                  <h2 style={{ fontWeight: 'bold' }}>{item.title}</h2>
                  <p>{item.category}</p>
                </IonLabel>
                
                <IonNote slot="end" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <IonText color={item.type === 'income' ? 'success' : 'danger'}>
                    <h3 style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
                      {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} ฿
                    </h3>
                  </IonText>
                  <IonBadge color={item.type === 'income' ? 'success' : 'danger'} style={{ fontSize: '0.7rem' }}>
                    {item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                  </IonBadge>
                </IonNote>
              </IonItem>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;