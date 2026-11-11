import { getFirebase } from './firebase.js?v=20261111-4';

const loginPanel = document.querySelector('#login-panel');
const dashboard = document.querySelector('#dashboard');
const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const status = loginForm?.querySelector('.form-status');
const submitButton = loginForm?.querySelector('button[type="submit"]');
const resetButton = document.querySelector('#reset-password');
const logoutButton = document.querySelector('#logout');
loginForm?.setAttribute('autocomplete', 'off');
emailInput?.setAttribute('autocomplete', 'off');
passwordInput?.setAttribute('autocomplete', 'new-password');
loginForm?.reset();
const LEGACY_POSTS_KEY = 'caos_publicacoes_v1';
const MIGRATED_POSTS_KEY = 'caos_publicacoes_migradas_firebase_v1';
let messageAfterSignOut = '';

function messageFor(error) {
  if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/invalid-login-credentials' || error?.code === 'auth/wrong-password' || error?.code === 'auth/user-not-found') return 'Email ou palavra-passe incorretos. Confirme que a conta foi criada no projeto Firebase teste-114ef.';
  if (error?.code === 'auth/invalid-email') return 'Introduza um email válido.';
  if (error?.code === 'auth/too-many-requests') return 'Foram feitas demasiadas tentativas. Tente novamente mais tarde.';
  if (error?.code === 'auth/operation-not-allowed') return 'Ative o método Email/palavra-passe em Firebase Console → Authentication → Sign-in method.';
  if (error?.code === 'auth/unauthorized-domain') return 'Adicione localhost em Firebase Console → Authentication → Settings → Authorized domains.';
  if (error?.code === 'auth/network-request-failed') return 'Sem ligação ao Firebase. Verifique a internet e tente novamente.';
  if (error?.code === 'auth/user-disabled') return 'Esta conta foi desativada no Firebase.';
  if (error?.code === 'auth/invalid-api-key') return 'A chave Firebase é inválida. Confirme a configuração Web da aplicação no Firebase.';
  if (error?.code === 'auth/web-storage-unsupported') return 'O navegador não permite guardar a sessão. Abra o site num navegador normal, não em modo privado.';
  if (error?.code === 'permission-denied') return 'A autenticação funcionou, mas o Firestore ainda não permite verificar o administrador. Crie a base de dados e publique as regras do ficheiro firestore.rules.';
  if (error?.code === 'failed-precondition' || error?.code === 'unavailable') return 'A base de dados Firestore ainda não está criada ou não está acessível. Siga FIRESTORE_SETUP.md.';
  return 'Não foi possível concluir a operação. Verifique a configuração Firebase e tente novamente.';
}

function passwordResetErrorMessage(error) {
  if (error?.code === 'auth/missing-email') return 'Introduza o email associado à conta.';
  if (error?.code === 'auth/invalid-email') return 'O formato do email não é válido. Corrija-o e tente novamente.';
  if (error?.code === 'auth/operation-not-allowed') return 'Ative Email/palavra-passe em Authentication → Sign-in method e confirme o modelo em Authentication → Templates.';
  if (error?.code === 'auth/unauthorized-continue-uri' || error?.code === 'auth/invalid-continue-uri') return 'O endereço de retorno do Firebase não está autorizado. Confirme Authentication → Settings → Authorized domains.';
  if (error?.code === 'auth/too-many-requests' || error?.code === 'auth/quota-exceeded') return 'Foram pedidos demasiados emails de redefinição. Aguarde e tente novamente.';
  if (error?.code === 'auth/network-request-failed') return 'Sem ligação ao Firebase. Verifique a internet e tente novamente.';
  return 'Não foi possível pedir a ligação. Confirme o email e a configuração de Authentication no Firebase.';
}
function setLoginStatus(message, color = '#a12929') {
  if (!status) return;
  status.textContent = message;
  status.style.color = color;
}

function showAuthError(error, customMessage = '') {
  loginPanel.hidden = false;
  dashboard.hidden = true;
  const message = customMessage || messageFor(error);
  const diagnostic = error?.code
    ? ' Código Firebase: ' + error.code + '.'
    : error?.message
      ? ' Detalhe técnico: ' + String(error.message).replace(/AIza[0-9A-Za-z_-]{30,}/g, '[chave omitida]').slice(0, 200)
      : error?.name ? ' Tipo de erro: ' + error.name + '.' : '';
  setLoginStatus(message + diagnostic);
}

async function migrateLegacyPosts(db, firestore) {
  if (localStorage.getItem(MIGRATED_POSTS_KEY)) return;
  const legacyPosts = JSON.parse(localStorage.getItem(LEGACY_POSTS_KEY) || 'null');
  if (!Array.isArray(legacyPosts) || !legacyPosts.length) return;
  const collectionRef = firestore.collection(db, 'posts');
  const existingSnapshot = await firestore.getDocs(collectionRef);
  const existingPosts = new Set(existingSnapshot.docs.map(item => {
    const post = item.data();
    return `${post.title}\u0000${post.text}`;
  }));
  for (const post of legacyPosts) {
    if (!post.title || !post.text || (post.image && post.image.length > 700000)) continue;
    const title = String(post.title).slice(0, 100);
    const text = String(post.text).slice(0, 1200);
    const key = `${title}\u0000${text}`;
    if (existingPosts.has(key)) continue;
    await firestore.addDoc(collectionRef, {
      title,
      text,
      image: post.image || '',
      createdAt: firestore.serverTimestamp(),
      updatedAt: firestore.serverTimestamp()
    });
    existingPosts.add(key);
  }
  localStorage.setItem(MIGRATED_POSTS_KEY, 'yes');
}

async function initializeFirebaseAuth() {
  setLoginStatus('A ligar ao Firebase…', '#555');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'A preparar login…';
  }
  if (resetButton) resetButton.disabled = true;
  try {
    const { auth, authSdk, db, firestore } = await getFirebase();
    await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);

    let authStateVersion = 0;
    authSdk.onAuthStateChanged(auth, async user => {
      const currentVersion = ++authStateVersion;
      loginPanel.hidden = false;
      dashboard.hidden = true;
      if (!user) {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Entrar';
        }
        if (resetButton) resetButton.disabled = false;
        if (messageAfterSignOut) {
          setLoginStatus(messageAfterSignOut);
          messageAfterSignOut = '';
        } else {
          setLoginStatus('');
        }
        return;
      }

      submitButton.disabled = true;
      resetButton.disabled = true;
      setLoginStatus('A confirmar as permissões da conta…', '#555');
      try {
        const adminSnapshot = await firestore.getDoc(firestore.doc(db, 'admins', user.uid));
        if (currentVersion !== authStateVersion) return;
        const isAdmin = adminSnapshot.exists() && adminSnapshot.data()?.role === 'admin';
        if (!isAdmin) {
          messageAfterSignOut = 'A palavra-passe foi aceite, mas esta conta ainda não está autorizada como administradora. UID desta conta: ' + user.uid + '. Siga FIRESTORE_SETUP.md para a autorizar.';
          passwordInput.value = '';
          setLoginStatus(messageAfterSignOut, '#a12929');
          await authSdk.signOut(auth);
          return;
        }

        messageAfterSignOut = '';
        loginPanel.hidden = true;
        dashboard.hidden = false;
        loginForm.reset();
        setLoginStatus('', '#176d43');
        window.renderAdminPosts?.();
        migrateLegacyPosts(db, firestore).catch(error => {
          console.error('Falha ao migrar publicações antigas:', error);
          window.setPostStatus?.('A sessão iniciou, mas não foi possível importar algumas publicações antigas.');
        });
      } catch (error) {
        if (currentVersion === authStateVersion) {
          messageAfterSignOut = messageFor(error);
          showAuthError(error, messageAfterSignOut);
          await authSdk.signOut(auth).catch(() => {});
        }
      }
    }, error => {
      messageAfterSignOut = messageFor(error);
      showAuthError(error, messageAfterSignOut);
      if (submitButton) submitButton.disabled = false;
      if (resetButton) resetButton.disabled = false;
    });

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      messageAfterSignOut = '';
      setLoginStatus('A entrar…', '#555');
      submitButton.disabled = true;
      try {
        await authSdk.signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
      } catch (error) {
        console.error('Falha ao iniciar sessão no Firebase:', error);
        passwordInput.value = '';
        showAuthError(error);
        submitButton.disabled = false;
      }
    });

    resetButton.addEventListener('click', async () => {
      const email = emailInput.value.trim();
      if (!email) {
        setLoginStatus('Introduza primeiro o email da conta.', '#a12929');
        emailInput.focus();
        return;
      }
      if (!emailInput.checkValidity()) {
        setLoginStatus('O formato do email não é válido. Corrija-o e tente novamente.', '#a12929');
        emailInput.focus();
        return;
      }
      const buttonLabel = resetButton.textContent;
      resetButton.disabled = true;
      resetButton.textContent = 'A enviar ligação…';
      setLoginStatus('A pedir a ligação de redefinição…', '#555');
      try {
        await authSdk.sendPasswordResetEmail(auth, email);
        setLoginStatus('Se este email estiver associado a uma conta, receberá uma ligação para redefinir a palavra-passe. Verifique também a pasta de spam.', '#176d43');
      } catch (error) {
        console.error('Erro ao pedir redefinição de palavra-passe:', error);
        showAuthError(error, passwordResetErrorMessage(error));
      } finally {
        resetButton.disabled = false;
        resetButton.textContent = buttonLabel;
      }
    });

    logoutButton.addEventListener('click', async () => {
      logoutButton.disabled = true;
      try {
        await authSdk.signOut(auth);
      } catch (error) {
        showAuthError(error);
      } finally {
        logoutButton.disabled = false;
      }
    });
  } catch (error) {
    showAuthError(error, 'Não foi possível iniciar o Firebase. Confirme a internet e abra esta página pelo endereço localhost através de INICIAR_SITE.bat; não use file://.');
  }
}

initializeFirebaseAuth();
