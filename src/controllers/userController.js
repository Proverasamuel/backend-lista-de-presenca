import { db, auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";

const usersCollection = collection(db, "users");

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ validar role
    const validRoles = ["aluno", "delegado", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Role inválida. Use: aluno, delegado ou admin." });
    }

    // ✅ criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // ✅ salvar dados no Firestore
    await addDoc(usersCollection, {
      uid: firebaseUser.uid,
      name,
      email,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Usuário criado com sucesso!", uid: firebaseUser.uid, role });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error: error.message });
  }
};


// ✅ Fazer login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { signInWithEmailAndPassword } = await import("firebase/auth");

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Opcional: gerar token para guardar no frontend
    const token = await user.getIdToken();

    res.status(200).json({ 
      message: "Login realizado com sucesso!", 
      user: { uid: user.uid, email: user.email }, 
      token 
    });
  } catch (error) {
    res.status(401).json({ message: "Falha na autenticação", error: error.message });
  }
};

// ✅ Listar usuários
export const getUsers = async (req, res) => {
  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error: error.message });
  }
};

// ✅ Outros métodos (getUserById, updateUser, deleteUser) permanecem iguais
