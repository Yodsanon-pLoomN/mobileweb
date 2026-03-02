import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { 
  IonApp, 
  IonRouterOutlet, 
  setupIonicReact, 
  IonLoading,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import { authService } from './auth/auth-service';

/* Import หน้าจอต่างๆ */
import Login from './pages/Login';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import LoginPhone from './pages/login-phone';

/* CSS พื้นฐานของ Ionic */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  // แยก State 2 ตัว: โหลดเสร็จหรือยัง? และ ล็อกอินหรือยัง?
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // สร้างระบบ "บังคับตอบกลับภายใน 3 วินาที" ป้องกันการค้างตลอดกาล
        const user: any = await Promise.race([
          authService.getCurrentUser(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Firebase Timeout")), 3000)
          )
        ]);
        
        setIsAuthenticated(!!user); 
      } catch (error) {
        console.warn("⚠️ ข้ามการตรวจสอบสิทธิ์ (เข้าหน้า Login แทน):", error);
        setIsAuthenticated(false); 
      } finally {
        // สำคัญที่สุด: ไม่ว่าจะพังหรือสำเร็จ ต้องปิดหน้าต่างโหลด!
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <IonApp>
      {/* 1. ให้ Component Loading เป็นแค่ตัวทับหน้าจอ ควบคุมด้วยตัวแปร isLoading */}
      <IonLoading isOpen={isLoading} message="กำลังตรวจสอบสิทธิ์..." spinner="bubbles" />

      {/* 2. เรนเดอร์ Route ก็ต่อเมื่อโหลดเสร็จแล้วเท่านั้น */}
      {!isLoading && (
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login-phone">
  {isAuthenticated ? <Redirect to="/tabs/tab1" /> : <LoginPhone />}
</Route>
            <Route exact path="/login">
              {isAuthenticated ? <Redirect to="/tabs/tab1" /> : <Login />}
            </Route>
            
            <Route path="/tabs">
              {!isAuthenticated ? (
                <Redirect to="/login" />
              ) : (
                <IonTabs>
                  <IonRouterOutlet>
                    <Route exact path="/tabs/tab1">
                      <Tab1 />
                    </Route>
                    <Route exact path="/tabs/tab2">
                      <Tab2 />
                    </Route>
                    <Route path="/tabs/tab3">
                      <Tab3 />
                    </Route>
                    <Route exact path="/tabs">
                      <Redirect to="/tabs/tab1" />
                    </Route>
                  </IonRouterOutlet>

                  <IonTabBar slot="bottom">
                    <IonTabButton tab="tab1" href="/tabs/tab1">
                      <IonIcon aria-hidden="true" icon={triangle} />
                      <IonLabel>ข้อมูลผู้ใช้</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="tab2" href="/tabs/tab2">
                      <IonIcon aria-hidden="true" icon={ellipse} />
                      <IonLabel>Tab 2</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="tab3" href="/tabs/tab3">
                      <IonIcon aria-hidden="true" icon={square} />
                      <IonLabel>Tab 3</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              )}
            </Route>

            <Route exact path="/">
              <Redirect to={isAuthenticated ? "/tabs/tab1" : "/login"} />
            </Route>

          </IonRouterOutlet>
        </IonReactRouter>
      )}
    </IonApp>
  );
};

export default App;