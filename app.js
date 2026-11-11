let posts = [];
let postsLoaded = false;
let postsError = '';
const MAX_IMAGE_BYTES = 500 * 1024;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
function postCard(post) { return `<article class="post-card">${post.image ? `<img src="${post.image}" alt="${escapeHtml(post.title)}">` : '<div class="post-placeholder">★</div>'}<div class="card-content"><p class="card-tag">ATLETAS OLÍMPICOS STP</p><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.text)}</p></div></article>`; }
function renderPublicPosts() { document.querySelectorAll('[data-posts]').forEach(grid => { const shown = grid.dataset.posts === 'featured' ? posts.slice(0, 3) : posts; grid.innerHTML = shown.map(postCard).join(''); const empty = grid.parentElement.querySelector('[data-empty]'); if (empty) { empty.hidden = shown.length > 0; const emptyMessage = grid.dataset.posts === 'featured' ? 'As novas publicações da área privada vão surgir aqui.' : 'Ainda não há novas publicações. O arquivo olímpico continua abaixo.'; empty.textContent = postsError || (postsLoaded ? emptyMessage : 'A carregar publicações…'); } }); }
function renderAdminPosts() { const container = document.querySelector('.admin-posts'); if (!container) return; if (!posts.length) { container.textContent = postsError || (postsLoaded ? 'Ainda não existem publicações.' : 'A carregar publicações…'); return; } container.innerHTML = posts.map(post => `<article class="admin-row"><div>${post.image ? `<img src="${post.image}" alt="">` : ''}<div><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.text)}</p></div></div><div class="admin-actions"><button data-edit="${post.id}">Editar</button><button class="delete" data-delete="${post.id}">Apagar</button></div></article>`).join(''); }
window.renderAdminPosts = renderAdminPosts;
function setPostStatus(message, color = '#a12929') { const status = document.querySelector('#post-status'); if (status) { status.textContent = message; status.style.color = color; } }
function readImage(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Não foi possível ler a imagem.')); reader.readAsDataURL(file); }); }
async function startPostSync() { try { const { getFirebase } = await import('./firebase.js?v=20261111-4'); const { db, firestore } = await getFirebase(); const postsQuery = firestore.query(firestore.collection(db, 'posts'), firestore.orderBy('createdAt', 'desc')); firestore.onSnapshot(postsQuery, snapshot => { posts = snapshot.docs.map(item => ({ id: item.id, ...item.data() })); postsLoaded = true; postsError = ''; renderPublicPosts(); renderAdminPosts(); }, error => { postsLoaded = true; postsError = error.code === 'permission-denied' ? 'As publicações ainda não estão acessíveis. Configure as regras do Firestore.' : 'Não foi possível carregar as publicações. Verifique a configuração do Firestore.'; renderPublicPosts(); renderAdminPosts(); console.error('Erro ao carregar publicações:', error); }); } catch (error) { postsLoaded = true; postsError = 'Não foi possível ligar ao Firebase para carregar as publicações.'; renderPublicPosts(); renderAdminPosts(); console.error('Erro ao inicializar publicações:', error); } }
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
const contactEmail = window.SITE_CONTACT_EMAIL;
document.querySelectorAll('[data-contact-email]').forEach(link => {
  link.href = `mailto:${contactEmail}`;
  link.textContent = contactEmail;
});
const menu = document.querySelector('.menu-toggle'); if (menu) menu.addEventListener('click', () => document.querySelector('nav').classList.toggle('open'));
renderPublicPosts();
startPostSync();
const aboutIntro = document.querySelector('.about-intro');
if (aboutIntro) {
  aboutIntro.querySelector('.btn')?.remove();
  const olympicSection = document.querySelector('.olympic-section');
  olympicSection?.insertAdjacentHTML('beforebegin', `<section class="olympic-section coi-section"><p class="eyebrow">MOVIMENTO OLÍMPICO</p><h2>Comité Olímpico Internacional</h2><div class="olympic-grid"><article><h3>COI</h3><p>O Comité Olímpico Internacional (COI, do inglês <em>International Olympic Committee</em>) é uma organização não governamental criada em 23 de junho de 1894.</p></article><article><h3>Fundador</h3><p>Foi criado por iniciativa do francês Pierre de Coubertin, responsável pelo renascimento moderno dos Jogos Olímpicos.</p></article><article><h3>Missão</h3><p>A sua finalidade é reinstituir os Jogos Olímpicos da antiga Grécia e organizar e promover a sua realização de quatro em quatro anos.</p></article></div></section>`);
  const coiSection = document.querySelector('.coi-section');
  if (coiSection) coiSection.innerHTML = `<p class="eyebrow">O QUE É O COI</p><h2>Comité Olímpico Internacional</h2><div class="olympic-grid"><article><h3>O que é</h3><p>O Comité Olímpico Internacional (COI, do inglês <em>International Olympic Committee</em>) é uma organização que orienta e promove o Movimento Olímpico.</p></article><article><h3>Fundação</h3><p>Foi criado a 23 de junho de 1894 pelo francês Pierre de Coubertin.</p></article><article><h3>Sede e natureza</h3><p>A sede fica em Lausana, na Suíça. É uma organização privada, independente e sem fins lucrativos.</p></article></div>`;
  coiSection?.insertAdjacentHTML('afterend', `<section class="olympic-section coi-details"><p class="eyebrow">MISSÃO E REGRAS</p><h2>Princípios do Movimento Olímpico</h2><div class="olympic-grid"><article><h3>Carta Olímpica</h3><p>Define os princípios e as regras que orientam o Movimento Olímpico e os seus membros.</p></article><article><h3>Valores e símbolos</h3><p>Proíbe qualquer discriminação racial, política ou religiosa. O COI detém os direitos sobre os símbolos, o hino e a bandeira olímpica.</p></article><article><h3>Financiamento</h3><p>É financiado por patrocínios, publicidade e pela venda de direitos de transmissão.</p></article><article><h3>Liderança atual</h3><p>A presidente é Kirsty Coventry, antiga nadadora do Zimbabué — a primeira mulher e a primeira pessoa africana a liderar a instituição.</p></article></div><p class="source">Fonte da liderança atual: <a href="https://newsroom.olympics.com/record/1651" target="_blank" rel="noopener">Comité Olímpico Internacional</a>.</p></section>`);
}
const coiFeature = document.querySelector('.coi-section');
if (coiFeature) {
  coiFeature.className = 'about-intro coi-section';
  coiFeature.innerHTML = `<figure><img src="carta-olimpica.png" alt="Capa da Carta Olímpica e retrato de Pierre de Coubertin"></figure><div><p class="eyebrow">O QUE É O COI</p><h2>Comité Olímpico Internacional</h2><p>O Comité Olímpico Internacional (COI, do inglês <em>International Olympic Committee</em>) orienta e promove o Movimento Olímpico.</p><p>Criado a 23 de junho de 1894 pelo francês Pierre de Coubertin, tem sede em Lausana, na Suíça.</p><p>É uma organização privada, independente e sem fins lucrativos, responsável por proteger os valores e os símbolos do olimpismo.</p></div>`;
}
if (coiFeature) {
  coiFeature.innerHTML = `<figure><img src="carta-olimpica.png" alt="Capa da Carta Olímpica e retrato de Pierre de Coubertin"></figure><div><p class="eyebrow">CARTA OLÍMPICA</p><h2>A Constituição dos Jogos Olímpicos</h2><p>A Carta Olímpica é o documento fundamental que rege todo o Movimento Olímpico. Criada pelo Barão Pierre de Coubertin em 1899 e continuamente atualizada pelo Comité Olímpico Internacional (COI), funciona como a “Constituição” dos Jogos Olímpicos.</p><ol><li><strong>Valores e princípios fundamentais:</strong> estabelece o Olimpismo como uma filosofia de vida que une corpo, mente e espírito, promovendo respeito, excelência, amizade e paz através do desporto.</li><li><strong>Cultura de não discriminação:</strong> garante que a prática desportiva é um direito humano, sem discriminação de raça, género, orientação sexual, religião ou opinião política.</li><li><strong>Estrutura do Movimento Olímpico:</strong> define os direitos e deveres do COI, das Federações Desportivas Internacionais e dos Comités Olímpicos Nacionais, como o COSTP.</li><li><strong>Protagonismo dos atletas:</strong> coloca a saúde, a segurança e a representatividade dos atletas no centro das decisões.</li><li><strong>Regras dos Jogos Olímpicos:</strong> define critérios de elegibilidade, o programa de modalidades e os rituais das cerimónias de abertura e encerramento.</li></ol></div>`;
  document.querySelector('.coi-details')?.remove();
}
const contact = document.querySelector('#contact-form'); if (contact) contact.addEventListener('submit', async event => {
  event.preventDefault();
  const status = contact.querySelector('.form-status');
  const submitButton = contact.querySelector('button[type="submit"]');
  const emailjsConfig = window.EMAILJS_CONFIG;
  const honeypot = contact.elements.namedItem('company_website');
  if (honeypot?.value?.trim()) {
    contact.reset();
    status.style.color = '#176d43';
    status.textContent = 'Mensagem enviada com sucesso. Obrigado pelo contacto!';
    return;
  }
  if (!window.emailjs || !emailjsConfig?.publicKey || !emailjsConfig?.serviceId || !emailjsConfig?.templateId) {
    status.textContent = 'O serviço de envio não está disponível neste momento. Tente novamente mais tarde ou contacte-nos por email.';
    return;
  }
  submitButton.disabled = true;
  status.style.color = '#555';
  status.textContent = 'A enviar mensagem…';
  try {
    await window.emailjs.sendForm(emailjsConfig.serviceId, emailjsConfig.templateId, contact, {
      publicKey: emailjsConfig.publicKey,
      limitRate: { id: 'caos-contact-form', throttle: 30000 }
    });
    contact.reset();
    status.style.color = '#176d43';
    status.textContent = 'Mensagem enviada com sucesso. Obrigado pelo contacto!';
  } catch (error) {
    console.error('Erro ao enviar mensagem de contacto:', error);
    status.style.color = '#a12929';
    status.textContent = 'Não foi possível enviar a mensagem. Os campos foram mantidos; tente novamente ou escreva para ' + contactEmail + '.';
  } finally {
    submitButton.disabled = false;
  }
});
const login = document.querySelector('#login-form');
if (login) {
  if (!document.querySelector('#post-status')) {
    const status = document.createElement('p');
    status.id = 'post-status';
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    document.querySelector('#post-form').append(status);
  }
  const postForm = document.querySelector('#post-form');
  postForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = postForm.querySelector('button[type="submit"], button:not([type])');
    const id = document.querySelector('#edit-id').value;
    const title = document.querySelector('#post-title').value.trim();
    const text = document.querySelector('#post-text').value.trim();
    const file = document.querySelector('#post-image').files[0];
    if (file && file.size > MAX_IMAGE_BYTES) {
      setPostStatus('A imagem deve ter no máximo 500 KB.');
      return;
    }
    submitButton.disabled = true;
    setPostStatus('A guardar publicação…', '#555');
    try {
      const { getFirebase } = await import('./firebase.js?v=20261111-4');
      const { db, firestore } = await getFirebase();
      const existing = posts.find(post => post.id === id);
      const image = file ? await readImage(file) : existing?.image || '';
      const data = { title, text, image, updatedAt: firestore.serverTimestamp() };
      if (id) {
        await firestore.updateDoc(firestore.doc(db, 'posts', id), data);
      } else {
        await firestore.addDoc(firestore.collection(db, 'posts'), { ...data, createdAt: firestore.serverTimestamp() });
      }
      postForm.reset();
      document.querySelector('#edit-id').value = '';
      document.querySelector('#cancel-edit').hidden = true;
      setPostStatus('Publicação guardada e visível para todos.', '#176d43');
    } catch (error) {
      console.error('Erro ao guardar publicação:', error);
      setPostStatus(error.code === 'permission-denied' ? 'Sem permissão. Publique as regras do Firestore incluídas no projeto.' : 'Não foi possível guardar. Confirme se a base de dados Firestore está criada e tente novamente.');
    } finally {
      submitButton.disabled = false;
    }
  });
  document.querySelector('#cancel-edit').addEventListener('click', () => { document.querySelector('#post-form').reset(); document.querySelector('#edit-id').value = ''; document.querySelector('#cancel-edit').hidden = true; });
  document.querySelector('.admin-posts').addEventListener('click', async event => {
    const id = event.target.dataset.edit || event.target.dataset.delete;
    if (!id) return;
    const post = posts.find(item => item.id === id);
    if (!post) return;
    if (event.target.dataset.delete) {
      if (!confirm('Apagar esta publicação?')) return;
      try {
        const { getFirebase } = await import('./firebase.js?v=20261111-4');
        const { db, firestore } = await getFirebase();
        await firestore.deleteDoc(firestore.doc(db, 'posts', id));
        setPostStatus('Publicação apagada.', '#176d43');
      } catch (error) {
        console.error('Erro ao apagar publicação:', error);
        setPostStatus('Não foi possível apagar. Confirme as regras do Firestore.');
      }
      return;
    }
    document.querySelector('#edit-id').value = post.id;
    document.querySelector('#post-title').value = post.title;
    document.querySelector('#post-text').value = post.text;
    document.querySelector('#cancel-edit').hidden = false;
    postForm.scrollIntoView({ behavior: 'smooth' });
  });
}
