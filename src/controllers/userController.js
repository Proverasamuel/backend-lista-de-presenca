import { db, auth } from "../config/firebase.js";

const usersCollection = db.collection("users");

// ✅ Criar usuário
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, universidadeId, turmaId } = req.body;

    // Verificação de campos obrigatórios
    if (!name || !email || !password || !role || !universidadeId || !turmaId) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const validRoles = ["aluno", "delegado", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Role inválida. Use: aluno, delegado ou admin." });
    }

    // 🔐 Criação do usuário no Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 💾 Salvamento no Firestore
    await usersCollection.doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      universidadeId,
      turmaId,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      uid: userRecord.uid,
      role,
      universidadeId,
      turmaId,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
  }
};


// ✅ Fazer login (apenas validação)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Autenticação com Firebase
    const user = await auth.getUserByEmail(email);

    // Buscar dados complementares
    const userDoc = await usersCollection.doc(user.uid).get();
    if (!userDoc.exists) return res.status(404).json({ message: "Usuário não encontrado" });

    const userData = userDoc.data();

    // 🔐 Gera token customizado (opcional)
    const token = await auth.createCustomToken(user.uid);

    res.json({
      token,
      user: {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: userData.role,
        universidadeId: userData.universidadeId,
        turmaId: userData.turmaId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no login", error: error.message });
  }
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
