
import { EmailAuthProvider } from 'firebase/auth';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      // ระบุว่าต้องการใช้อีเมลและรหัสผ่านในการล็อกอิน
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      // กำหนดให้ต้องใส่ชื่อตอนสมัครสมาชิก
      requireDisplayName: true, 
    },
  ],
  callbacks: {
    // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้ล็อกอินสำเร็จ
    signInSuccessWithAuthResult: function (authResult: any) {
      if (authResult.user) {
        // ดึง ID token ของผู้ใช้
        authResult.user.getIdToken().then((idToken: string) => {
          // ส่ง token ไปยัง backend เพื่อสร้าง session cookie
          return fetch('/api/auth', {
            method: 'POST',
            body: idToken,
          });
        });
      }
      // คืนค่า true เพื่อ redirect ไปยังหน้าหลักหลังจากล็อกอินสำเร็จ
      return true;
    },
  },
};

export default uiConfig;
