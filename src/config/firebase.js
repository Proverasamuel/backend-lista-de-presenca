import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// 🔐 Chave de serviço (service account) vinda do .env
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
