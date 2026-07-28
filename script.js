/* =========================================
   MAGE LANDING PAGE — script.js
   ========================================= */

// ── Chat content per section ──────────────────────────────────────────────────
const sectionChats = {
  stocks: [
    { type: 'sent', text: 'Buy $200 of NVDA' },
    { type: 'recv', text: '⚡ NVDA token — $200 market buy on Robinhood Chain. Confirm?' },
    { type: 'sent', text: 'Yes' },
    { type: 'recv', text: '✅ Filled. $200 NVDA · avg $128.42 · Sunday 2:14 PM' },
  ],
  perps: [
    { type: 'sent', text: 'Open 3x long ETH, $100' },
    { type: 'recv', text: '📊 ETH perp — 3× long · $100 · liq ~$2,210\nConfirm?' },
    { type: 'sent', text: 'Confirm' },
    { type: 'recv', text: '✅ ETH long open · entry $3,418 · liq $2,210\nI\'ll alert if liq gets close.' },
  ],
  memes: [
    { type: 'sent', text: "What's trending right now?" },
    { type: 'recv', text: '🔥 Top movers on Robinhood Chain:\n1. $CASHCAT +38%\n2. $PEPEKING +22%\n3. $DOGE2 +17%\n\nWant me to buy any?' },
    { type: 'sent', text: 'Buy $50 of $CASHCAT' },
    { type: 'recv', text: '✅ $50 $CASHCAT — filled at $0.00412' },
  ],
  predictions: [
    { type: 'sent', text: 'Will the Fed cut rates in July?' },
    { type: 'recv', text: '📈 Polymarket: Fed cuts July — YES at 62¢\nBet $50 YES?' },
    { type: 'sent', text: 'Yes, bet $50' },
    { type: 'recv', text: '✅ $50 YES · Fed cut July · avg 62¢\nPayout if YES: $80.65' },
  ],
  bridge: [
    { type: 'sent', text: 'Fund from my Coinbase wallet' },
    { type: 'recv', text: '🌉 Bridging from Base → Robinhood Chain\nDetected: $342.18 USDC on Base\n\nHow much to move?' },
    { type: 'sent', text: 'Move $200' },
    { type: 'recv', text: '✅ $200 bridged in ~12 sec · ready to trade' },
  ],
  portfolio: [
    { type: 'sent', text: "How's my portfolio?" },
    { type: 'recv', text: '📊 Your portfolio — $342.18 (+$12.04 today)\n\n• NVDA token $200 · +2.1%\n• ETH perp $100 · +$3.50\n• $CASHCAT $50 · +38%\n• USDC $68.52' },
  ],
  cashout: [
    { type: 'sent', text: 'Cash out my NVDA gains' },
    { type: 'recv', text: '💰 Sell NVDA token $200 → USDC?\nCurrent price: $131.20 (+$2.78)' },
    { type: 'sent', text: 'Yes, sell all' },
    { type: 'recv', text: '✅ NVDA sold · $204.34 USDC on Robinhood Chain\nWithdraw to your bank?' },
  ],
};

// ── Hero chat messages ────────────────────────────────────────────────────────
const heroMessages = [
  { type: 'sent', text: 'Buy $200 of NVDA' },
  { type: 'recv', text: '⚡ NVDA · $200 market buy · Confirm?' },
  { type: 'sent', text: 'Yes' },
  { type: 'recv', text: '✅ Filled at $128.40' },
];

// ── Rotating hero word ────────────────────────────────────────────────────────
const rotatingWords = ['everything', 'stocks', 'crypto', 'perps', 'memecoins'];
let wordIdx = 0;

function rotateWord() {
  const el = document.getElementById('rotating-word');
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(-8px)';
  setTimeout(() => {
    wordIdx = (wordIdx + 1) % rotatingWords.length;
    el.textContent = rotatingWords[wordIdx];
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }, 300);
}

// ── Render chat bubbles ───────────────────────────────────────────────────────
function renderBubble(msg, delay = 0) {
  const row = document.createElement('div');
  row.className = `bubble-row ${msg.type}`;
  const bub = document.createElement('div');
  bub.className = `bubble ${msg.type}`;
  bub.style.animationDelay = `${delay}ms`;
  // Support line breaks
  bub.innerHTML = msg.text.replace(/\n/g, '<br>');
  row.appendChild(bub);
  return row;
}

function populateHeroChat() {
  const container = document.getElementById('hero-messages');
  if (!container) return;
  container.innerHTML = '';
  heroMessages.forEach((msg, i) => {
    const el = renderBubble(msg, i * 200);
    container.appendChild(el);
  });
}

function populateFeatureChats() {
  document.querySelectorAll('.chat-mock[data-section]').forEach(mock => {
    const section = mock.dataset.section;
    const msgs = sectionChats[section];
    if (!msgs) return;
    mock.innerHTML = '';
    msgs.forEach((msg, i) => {
      const el = renderBubble(msg, i * 100);
      mock.appendChild(el);
    });
  });
}

// ── Section dot labels ────────────────────────────────────────────────────────
function buildDotLabels() {
  document.querySelectorAll('.side-dot').forEach(dot => {
    const label = document.createElement('span');
    label.className = 'dot-label';
    label.textContent = dot.dataset.label || '';
    dot.appendChild(label);
    dot.addEventListener('click', () => {
      const target = dot.dataset.target;
      scrollToSection(target);
    });
  });
}

// ── Scroll helpers ────────────────────────────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const container = document.getElementById('scroll-container');
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Intersection / active section tracking ────────────────────────────────────
const featureSectionIds = ['stocks', 'perps', 'memes', 'predictions', 'bridge', 'portfolio', 'cashout', 'cta'];

function onScroll() {
  const container = document.getElementById('scroll-container');
  const scrollTop = container.scrollTop;
  const viewH = container.clientHeight;

  // Show/hide floating button (show after scrolling past hero)
  const heroEl = document.getElementById('top');
  const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight : 0;
  const floatBtn = document.getElementById('float-btn-wrap');
  if (scrollTop > heroBottom * 0.6) {
    floatBtn.classList.add('visible');
  } else {
    floatBtn.classList.remove('visible');
  }

  // Side nav visibility: show during feature sections
  const sideNav = document.getElementById('side-nav');
  const stocksEl = document.getElementById('stocks');
  const marketsEl = document.getElementById('markets');
  const stocksTop = stocksEl ? stocksEl.offsetTop : 0;
  const marketsTop = marketsEl ? marketsEl.offsetTop : Infinity;

  if (scrollTop >= stocksTop - 10 && scrollTop < marketsTop - 10) {
    sideNav.classList.add('visible');
  } else {
    sideNav.classList.remove('visible');
  }

  // Update active dot
  let activeSection = null;
  featureSectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop;
    if (scrollTop >= top - viewH * 0.4) {
      activeSection = id;
    }
  });
  document.querySelectorAll('.side-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.target === activeSection);
  });

  // CTA section: show content
  const ctaEl = document.getElementById('cta');
  const ctaContent = document.getElementById('cta-content');
  if (ctaEl && ctaContent) {
    const ctaTop = ctaEl.offsetTop;
    if (scrollTop >= ctaTop - viewH * 0.5) {
      ctaContent.classList.add('visible');
    }
  }
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.faq-row');
      const isOpen = row.dataset.open === 'true';
      // Close all
      document.querySelectorAll('.faq-row').forEach(r => {
        r.dataset.open = 'false';
        r.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        row.dataset.open = 'true';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// ── Copy contract address ─────────────────────────────────────────────────────
function initCABtn() {
  const btn = document.getElementById('ca-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const addr = btn.querySelector('.ca-addr').textContent;
    navigator.clipboard.writeText(addr).then(() => {
      const icon = btn.querySelector('svg');
      icon.style.color = '#1E9E6A';
      setTimeout(() => { icon.style.color = ''; }, 1500);
    }).catch(() => {});
  });
}

// ── Animated chat replay for feature sections ─────────────────────────────────
function animateChatOnVisible() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const mock = entry.target;
        const section = mock.dataset.section;
        const msgs = sectionChats[section];
        if (!msgs) return;
        mock.innerHTML = '';
        msgs.forEach((msg, i) => {
          setTimeout(() => {
            const el = renderBubble(msg, 0);
            mock.appendChild(el);
          }, i * 450);
        });
        observer.unobserve(mock);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.chat-mock[data-section]').forEach(mock => {
    observer.observe(mock);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateHeroChat();
  buildDotLabels();
  initFAQ();
  initCABtn();
  animateChatOnVisible();

  const container = document.getElementById('scroll-container');
  container.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Rotate hero word every 2.5s
  setInterval(rotateWord, 2500);
});
