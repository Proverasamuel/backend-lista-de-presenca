import { db, auth } from "../config/firebase.js";

const usersCollection = db.collection("users");

// ✅ Criar usuário
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const validRoles = ["aluno", "delegado", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Role inválida. Use: aluno, delegado ou admin." });
    }

    // 🔐 Cria o usuário com Firebase Auth (Admin SDK)
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 💾 Salva dados complementares no Firestore
    await usersCollection.doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Usuário criado com sucesso!", uid: userRecord.uid, role });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
  }
};

// ✅ Fazer login (apenas validação)
export const loginUser = async (req, res) => {
  res.status(501).json({ message: "Login deve ser feito no frontend usando Firebase Auth SDK." });
};

// ✅ Listar usuários
export const getUsers = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error: error.message });
  }
};
