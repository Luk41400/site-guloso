/* ==========================================================================
   GATO GULOSO - INTERATIVIDADE & EFEITOS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------------------
  // 1. ÁUDIO INTERATIVO (Web Audio API - Sem necessidade de arquivos externos)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sintetizador de Ronrom Felino (Frequência baixa modulada a ~26Hz)
  function playPurrSound() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const mod = audioCtx.createOscillator();
      const modGain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, audioCtx.currentTime);

      // Tremolo felino de ronronar
      mod.type = 'sine';
      mod.frequency.setValueAtTime(26, audioCtx.currentTime);
      modGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      mod.connect(gain.gain);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      mod.start();
      osc.start();

      osc.stop(audioCtx.currentTime + 0.6);
      mod.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio Context Purr:", e);
    }
  }

  // Sintetizador de Miado Curto e Doce ("Miau!")
  function playMeowSound() {
    if (!soundEnabled) return;
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      const now = audioCtx.currentTime;
      osc.type = 'triangle';

      // Curva melódica do miado: sobe de 420Hz para ~680Hz e desce para 480Hz
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.45);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(2, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio Context Meow:", e);
    }
  }

  // Toggle de Som
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        soundToggleBtn.classList.add('sound-active');
        playMeowSound();
      } else {
        soundToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        soundToggleBtn.classList.remove('sound-active');
      }
    });
  }

  const btnSoundPurr = document.getElementById('btnSoundPurr');
  if (btnSoundPurr) {
    btnSoundPurr.addEventListener('click', () => {
      playMeowSound();
    });
  }

  // -------------------------------------------------------------------------
  // 2. TEMA CLARO / ESCURO (Dark Mode)
  // -------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const htmlTag = document.documentElement;

  // Restaurar tema salvo
  const savedTheme = localStorage.getItem('gato-guloso-theme') || 'light';
  htmlTag.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlTag.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      htmlTag.setAttribute('data-theme', next);
      localStorage.setItem('gato-guloso-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'dark') {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeToggle.title = 'Alternar para tema claro';
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
      themeToggle.title = 'Alternar para tema escuro';
    }
  }

  // -------------------------------------------------------------------------
  // 3. MENU MOBILE RESPONSIVO
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const isOpen = navLinks.classList.contains('show');
      mobileMenuBtn.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Fechar ao clicar em link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. SIMULADOR DE CARINHO & RONRONÔMETRO
  // -------------------------------------------------------------------------
  const catPetZone = document.getElementById('catPetZone');
  const patHand = document.getElementById('patHand');
  const heartsContainer = document.getElementById('heartsContainer');
  const happinessFill = document.getElementById('happinessFill');
  const happinessLevel = document.getElementById('happinessLevel');
  const catStatusQuote = document.getElementById('catStatusQuote');
  const petCountSpan = document.getElementById('petCount');
  const treatsGivenSpan = document.getElementById('treatsGiven');
  const statPurrs = document.getElementById('statPurrs');

  let happiness = 20;
  let petsCount = 0;
  let treatsCount = 0;

  const quotes = [
    { min: 0, max: 25, text: '"Hmm... aceito mais um cafuné atrás da orelhinha, humano."' },
    { min: 26, max: 50, text: '"Prrr... essa massagem tá no ponto certo! Não ouse parar."' },
    { min: 51, max: 75, text: '"Miau! Estou amassando pãozinho imaginário de tanta satisfação."' },
    { min: 76, max: 99, text: '"Ronrom ativado na potência máxima! Você é meu humano favorito hoje."' },
    { min: 100, max: 100, text: '"🏆 FELICIDADE MÁXIMA ALCANÇADA! O gato está em nirvana gastronômico e afetivo!"' }
  ];

  function updateHappiness(amount) {
    happiness = Math.min(100, Math.max(0, happiness + amount));
    if (happinessFill) happinessFill.style.width = `${happiness}%`;
    if (happinessLevel) happinessLevel.textContent = `${happiness}%`;

    const foundQuote = quotes.find(q => happiness >= q.min && happiness <= q.max);
    if (foundQuote && catStatusQuote) {
      catStatusQuote.textContent = foundQuote.text;
    }
  }

  function spawnFloatingParticle(x, y, emoji = '💖') {
    if (!heartsContainer) return;
    const particle = document.createElement('span');
    particle.className = 'floating-heart';
    particle.textContent = emoji;

    const rect = heartsContainer.getBoundingClientRect();
    const posX = x ? (x - rect.left) : (rect.width / 2 + (Math.random() * 80 - 40));
    const posY = y ? (y - rect.top) : (rect.height / 2 + (Math.random() * 40 - 20));

    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;

    heartsContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1200);
  }

  if (catPetZone) {
    catPetZone.addEventListener('click', (e) => {
      petsCount++;
      if (petCountSpan) petCountSpan.textContent = petsCount;
      if (statPurrs) statPurrs.textContent = `${(1800 + petsCount).toLocaleString()}+`;

      // Animação da patinha de carinho
      if (patHand) {
        patHand.classList.add('show');
        setTimeout(() => patHand.classList.remove('show'), 200);
      }

      // Efeitos sonoros e visuais
      playPurrSound();
      const emojis = ['💖', '✨', '🐾', '🥰', '💕'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      spawnFloatingParticle(e.clientX, e.clientY, randomEmoji);

      updateHappiness(4);
    });
  }

  // Botões de Petiscos Rápidos
  const treatBtns = document.querySelectorAll('.treat-btn');
  treatBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const boost = parseInt(btn.getAttribute('data-boost'), 10) || 15;
      const icon = btn.querySelector('.treat-icon')?.textContent || '🐟';

      treatsCount++;
      if (treatsGivenSpan) treatsGivenSpan.textContent = treatsCount;

      playMeowSound();
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          spawnFloatingParticle(null, null, icon);
        }, i * 150);
      }

      updateHappiness(boost);
    });
  });

  // -------------------------------------------------------------------------
  // 5. FILTRO DE RAÇAS
  // -------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.breed-filter-tabs .filter-tab');
  const breedCards = document.querySelectorAll('.breeds-grid .breed-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      breedCards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        if (filterVal === 'all' || tags.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. BUSCA E FILTROS DE NUTRIÇÃO (PODE OU NÃO PODE)
  // -------------------------------------------------------------------------
  const foodSearchInput = document.getElementById('foodSearchInput');
  const foodTabs = document.querySelectorAll('.food-tabs .food-tab');
  const foodCards = document.querySelectorAll('.food-cards-grid .food-card');

  let currentCategory = 'all';

  function filterFoods() {
    const query = foodSearchInput ? foodSearchInput.value.toLowerCase().trim() : '';

    foodCards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const text = card.textContent.toLowerCase();
      const matchesSearch = !query || title.includes(query) || text.includes(query);

      let matchesCategory = true;
      if (currentCategory === 'allowed') {
        matchesCategory = card.classList.contains('allowed');
      } else if (currentCategory === 'danger') {
        matchesCategory = card.classList.contains('danger');
      }

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (foodSearchInput) {
    foodSearchInput.addEventListener('input', filterFoods);
  }

  foodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      foodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      filterFoods();
    });
  });

  // -------------------------------------------------------------------------
  // 7. GERADOR DE FATOS FELINOS INTERATIVO
  // -------------------------------------------------------------------------
  const catFacts = [
    {
      tag: "🦴 Anatomia Extraordinária",
      text: "Gatos não possuem clavícula verdadeira conectada ao resto do esqueleto. Se a cabeça deles passar por uma fresta, o corpo inteiro passa com facilidade!"
    },
    {
      tag: "👅 Paladar Seletivo",
      text: "Gatos são os únicos mamíferos conhecidos que geneticamente não sentem o gosto doce! Eles evoluíram como carnívoros estritos focados no sabor umami e proteínas."
    },
    {
      tag: "👃 Biometria Exclusiva",
      text: "Assim como nós temos impressões digitais nos dedos, cada gatinho possui um desenho único e irrepetível de saliências e linhas na ponta do focinho!"
    },
    {
      tag: "💤 Campeões do Sono",
      text: "Um gato de 9 anos passou em média 6 anos inteiros dormindo! O sono profundo preserva suas reservas de energia de predador de alta explosão."
    },
    {
      tag: "👂 Super Audição",
      text: "Gatos conseguem mover cada uma das duas orelhas de forma 100% independente em até 180 graus, operando como verdadeiras antenas parabólicas de alta precisão."
    },
    {
      tag: "🥛 O Mito do Leite",
      text: "Ao contrário dos desenhos animados antigos, a grande maioria dos gatos adultos perde a enzima lactase e passa mal ao beber leite de vaca!"
    },
    {
      tag: "⚡ Super Salto",
      text: "A musculatura traseira dos felinos permite que eles saltem verticalmente até 6 vezes a própria altura em um único impulso suave."
    }
  ];

  let currentFactIndex = 0;
  const btnNewFact = document.getElementById('btnNewFact');
  const factTag = document.getElementById('factTag');
  const factNumber = document.getElementById('factNumber');
  const factText = document.getElementById('factText');

  if (btnNewFact) {
    btnNewFact.addEventListener('click', () => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * catFacts.length);
      } while (nextIndex === currentFactIndex && catFacts.length > 1);

      currentFactIndex = nextIndex;
      const fact = catFacts[currentFactIndex];

      if (factTag) factTag.textContent = fact.tag;
      if (factNumber) factNumber.textContent = `Fato #${currentFactIndex + 1}`;
      if (factText) {
        factText.style.opacity = '0';
        setTimeout(() => {
          factText.textContent = `"${fact.text}"`;
          factText.style.opacity = '1';
        }, 150);
      }
      playPurrSound();
    });
  }

  // -------------------------------------------------------------------------
  // 8. CALCULADORA DE IDADE FELINA
  // -------------------------------------------------------------------------
  const catYearsInput = document.getElementById('catYearsInput');
  const btnMinusYear = document.getElementById('btnMinusYear');
  const btnPlusYear = document.getElementById('btnPlusYear');
  const humanYearsResult = document.getElementById('humanYearsResult');
  const catStageBadge = document.getElementById('catStageBadge');
  const catStageDesc = document.getElementById('catStageDesc');

  function calculateCatAge(age) {
    let humanAge = 0;
    if (age <= 1) {
      humanAge = 15;
    } else if (age === 2) {
      humanAge = 24;
    } else {
      humanAge = 24 + (age - 2) * 4;
    }

    if (humanYearsResult) humanYearsResult.textContent = humanAge;

    if (catStageBadge && catStageDesc) {
      if (age <= 1) {
        catStageBadge.textContent = "Filhote Travesso 🐾";
        catStageDesc.textContent = "Muita curiosidade, dentes afiados para morder caixas e energia infinita!";
      } else if (age <= 6) {
        catStageBadge.textContent = "Jovem Adulto no Auge! ⚡";
        catStageDesc.textContent = "No auge atlético: caça moscas invisíveis e corre pela casa às 3 da madrugada.";
      } else if (age <= 10) {
        catStageBadge.textContent = "Adulto Pleno & Sábio 🧘";
        catStageDesc.textContent = "Aprecia a rotina, o sachê na hora certa e horas intermináveis de cochilo ao sol.";
      } else {
        catStageBadge.textContent = "Gato Sênior & Nobre 👑";
        catStageDesc.textContent = "Um verdadeiro ancião venerado! Merece caminhas super macias, visitas regulares ao vet e carinho extra.";
      }
    }
  }

  if (catYearsInput) {
    catYearsInput.addEventListener('input', () => {
      let val = parseInt(catYearsInput.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 25) val = 25;
      calculateCatAge(val);
    });

    if (btnMinusYear) {
      btnMinusYear.addEventListener('click', () => {
        let val = parseInt(catYearsInput.value, 10) || 1;
        if (val > 1) {
          val--;
          catYearsInput.value = val;
          calculateCatAge(val);
        }
      });
    }

    if (btnPlusYear) {
      btnPlusYear.addEventListener('click', () => {
        let val = parseInt(catYearsInput.value, 10) || 1;
        if (val < 25) {
          val++;
          catYearsInput.value = val;
          calculateCatAge(val);
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9. QUIZ FELINO INTERATIVO
  // -------------------------------------------------------------------------
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizResult = document.getElementById('quizResult');
  const btnRestartQuiz = document.getElementById('btnRestartQuiz');
  const resIcon = document.getElementById('resIcon');
  const resTitle = document.getElementById('resTitle');
  const resDesc = document.getElementById('resDesc');

  let selectedTraits = [];

  const quizProfiles = {
    comilao: {
      icon: "🐟",
      title: "Você é o Chef Supremo do Sachê!",
      desc: "Você tem um radar infalível para petiscos e sabe exatamente quando alguém abre a geladeira. Adora comida boa, conforto cinco estrelas e faz carinha de coitado só pra ganhar um biscoitinho a mais!"
    },
    curioso: {
      icon: "📦",
      title: "Você é o Investigador de Caixas!",
      desc: "Nenhuma gaveta aberta ou porta entreaberta escapa dos seus olhos. Você adora novidades, analisa tudo antes de confiar e tem a inteligência afiada como uma garra de gato caçador!"
    },
    preguicoso: {
      icon: "🛋️",
      title: "Você é o Mestre do Modo Pãozinho!",
      desc: "Seu esporte favorito é encontrar a mancha de sol mais quentinha no chão da sala. Você sabe relaxar de verdade, não se estressa com bobagens e derrete com um bom cafuné no pescoço."
    }
  };

  quizSteps.forEach(step => {
    const opts = step.querySelectorAll('.quiz-opt');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        const trait = opt.getAttribute('data-trait');
        selectedTraits.push(trait);

        const currentStepNum = parseInt(step.getAttribute('data-step'), 10);
        step.classList.remove('active');

        const nextStep = document.querySelector(`.quiz-step[data-step="${currentStepNum + 1}"]`);
        if (nextStep) {
          nextStep.classList.add('active');
        } else {
          // Exibir Resultado
          finishQuiz();
        }
        playPurrSound();
      });
    });
  });

  function finishQuiz() {
    if (!quizResult) return;

    // Calcular frequência de traços
    const counts = { comilao: 0, curioso: 0, preguicoso: 0 };
    selectedTraits.forEach(t => {
      if (counts[t] !== undefined) counts[t]++;
    });

    let topTrait = 'comilao';
    let max = -1;
    for (const [trait, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        topTrait = trait;
      }
    }

    const profile = quizProfiles[topTrait];
    if (resIcon) resIcon.textContent = profile.icon;
    if (resTitle) resTitle.textContent = profile.title;
    if (resDesc) resDesc.textContent = profile.desc;

    quizResult.style.display = 'block';
    playMeowSound();
  }

  if (btnRestartQuiz) {
    btnRestartQuiz.addEventListener('click', () => {
      selectedTraits = [];
      if (quizResult) quizResult.style.display = 'none';
      quizSteps.forEach((s, idx) => {
        s.classList.toggle('active', idx === 0);
      });
    });
  }

});
