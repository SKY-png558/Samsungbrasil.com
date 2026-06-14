// ====================================
// AUTENTICAÇÃO - LOGIN
// ====================================

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider } 
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0V2t-XvpTq_2r_Z0YLc9_-3YF_1c4Mo0",
  authDomain: "samsung-cd18d.firebaseapp.com",
  projectId: "samsung-cd18d",
  storageBucket: "samsung-cd18d.firebasestorage.app",
  messagingSenderId: "582826463476",
  appId: "1:582826463476:web:063e0b28af2d2626d24ea1",
  measurementId: "G-Y3GJJTRXQ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Função de Login com Email
window.fazerLogin = async function() {
  const email = document.getElementById('email')?.value.trim();
  const senha = document.getElementById('senha')?.value;
  const mensagemEl = document.getElementById('mensagem');
  const loadingEl = document.getElementById('loading');
  const loginFormEl = document.getElementById('loginForm');

  console.log('Tentando login com:', email);

  if (!email || !senha) {
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = '❌ Preencha todos os campos!';
      mensagemEl.style.display = 'block';
    }
    return;
  }

  if (!email.includes('@')) {
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = '❌ E-mail inválido!';
      mensagemEl.style.display = 'block';
    }
    return;
  }

  try {
    if (loadingEl) loadingEl.style.display = 'block';
    if (loginFormEl) loginFormEl.style.opacity = '0.5';
    if (mensagemEl) mensagemEl.style.display = 'none';

    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    console.log('Login bem-sucedido:', user.uid);

    // Salvar no localStorage
    localStorage.setItem('userLogged', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));

    if (mensagemEl) {
      mensagemEl.className = 'mensagem sucesso';
      mensagemEl.textContent = '✅ Login realizado! Redirecionando...';
      mensagemEl.style.display = 'block';
    }

    setTimeout(() => {
      window.location.href = 'show.html';
    }, 1500);

  } catch (err) {
    console.error('Erro no login:', err.code, err.message);
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (loginFormEl) loginFormEl.style.opacity = '1';
    
    let mensagemErro = '❌ Erro ao fazer login';
    
    if (err.code === 'auth/user-not-found') {
      mensagemErro = '❌ E-mail não cadastrado!';
    } else if (err.code === 'auth/wrong-password') {
      mensagemErro = '❌ Senha incorreta!';
    } else if (err.code === 'auth/invalid-email') {
      mensagemErro = '❌ E-mail inválido!';
    } else if (err.code === 'auth/too-many-requests') {
      mensagemErro = '❌ Muitas tentativas! Tente novamente mais tarde.';
    } else if (err.message) {
      mensagemErro = '❌ ' + err.message;
    }
    
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = mensagemErro;
      mensagemEl.style.display = 'block';
    }
  }
};

// Função de Login com Google
window.googleLogin = async function() {
  const mensagemEl = document.getElementById('mensagem');
  const loadingEl = document.getElementById('loading');
  const loginFormEl = document.getElementById('loginForm');

  try {
    if (loadingEl) loadingEl.style.display = 'block';
    if (loginFormEl) loginFormEl.style.opacity = '0.5';
    if (mensagemEl) mensagemEl.style.display = 'none';

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('Login Google bem-sucedido:', user.uid);

    // Criar usuário no Firestore caso não exista
const userRef = doc(db, "usuarios", user.uid);
const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {

  const nomeCompleto = user.displayName || "";
  const partesNome = nomeCompleto.split(" ");

  await setDoc(userRef, {
    nome: partesNome[0] || "",
    sobrenome: partesNome.slice(1).join(" ") || "",
    email: user.email || "",
    telefone: "",
    dataNascimento: "",
    fotoPerfil: user.photoURL || "",
    criadoEm: new Date().toISOString()
  });

  console.log("Usuário Google criado no Firestore");
}

    // Salvar no localStorage
    localStorage.setItem('userLogged', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));
    

    if (mensagemEl) {
      mensagemEl.className = 'mensagem sucesso';
      mensagemEl.textContent = '✅ Login com Google realizado! Redirecionando...';
      mensagemEl.style.display = 'block';
    }

    setTimeout(() => {
      window.location.href = 'show.html';
    }, 1500);

  } catch (err) {
    console.error('Erro no login Google:', err.code, err.message);
    
    if (loadingEl) loadingEl.style.display = 'none';
    if (loginFormEl) loginFormEl.style.opacity = '1';
    
    let mensagemErro = '❌ Erro ao fazer login com Google';
    
    if (err.code === 'auth/popup-closed-by-user') {
      mensagemErro = '⚠️ Você fechou a janela de login.';
    } else if (err.code === 'auth/cancelled-popup-request') {
      mensagemErro = '⚠️ Login cancelado.';
    } else if (err.message) {
      mensagemErro = '❌ ' + err.message;
    }
    
    if (mensagemEl) {
      mensagemEl.className = 'mensagem erro';
      mensagemEl.textContent = mensagemErro;
      mensagemEl.style.display = 'block';
    }
  }
};

// Validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const mensagemEl = document.getElementById('mensagem');

  console.log('✅ Firebase Config Carregado');
  console.log('Auth inicializado:', auth ? 'SIM' : 'NÃO');

  if (emailInput) {
    emailInput.addEventListener('input', function() {
      if (mensagemEl) mensagemEl.style.display = 'none';
    });

    // Permite login ao pressionar Enter na senha
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        senhaInput?.focus();
      }
    });
  }

  if (senhaInput) {
    senhaInput.addEventListener('input', function() {
      if (mensagemEl) mensagemEl.style.display = 'none';
    });

    // Permite login ao pressionar Enter
    senhaInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        fazerLogin();
      }
    });
  }

  // Log de status
  console.log('📱 Login Page Ready');
});