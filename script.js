(function () {
  'use strict';

  // ── DOM REFERENCES ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const clockEl = $('#digitalClock .clock-time');
  const tabLogin = $('#tabLogin');
  const tabRegister = $('#tabRegister');
  const tabIndicator = $('#tabIndicator');
  const loginForm = $('#loginForm');
  const registerForm = $('#registerForm');
  const loginAlert = $('#loginAlert');
  const registerAlert = $('#registerAlert');
  const dataStreamEl = $('#dataStream');
  const sessionIdEl = $('#sessionId');
  const switchToRegister = $('#switchToRegister');
  const switchToLogin = $('#switchToLogin');

  // ── DIGITAL CLOCK ──
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── SESSION ID GENERATOR ──
  function generateSessionId() {
    const chars = '0123456789ABCDEF';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
  }
  sessionIdEl.textContent = generateSessionId();

  // ── DATA STREAM ANIMATION ──
  const streamChars = '01█▓░▒▐▌├┤┬┴╫╬═║';
  function updateDataStream() {
    let stream = '';
    const len = Math.min(Math.floor(window.innerWidth / 12), 60);
    for (let i = 0; i < len; i++) {
      stream += streamChars[Math.floor(Math.random() * streamChars.length)];
    }
    dataStreamEl.textContent = stream;
  }
  updateDataStream();
  setInterval(updateDataStream, 150);

  // ═══════════════════════════════════════════
  // TAB SWITCHING
  // ═══════════════════════════════════════════
  let currentTab = 'login';

  function switchTab(tab) {
    if (tab === currentTab) return;
    currentTab = tab;

    // Update tabs
    tabLogin.classList.toggle('active', tab === 'login');
    tabRegister.classList.toggle('active', tab === 'register');

    // Move indicator
    tabIndicator.style.transform = tab === 'register' ? 'translateX(100%)' : 'translateX(0)';

    // Switch forms with animation
    const showForm = tab === 'login' ? loginForm : registerForm;
    const hideForm = tab === 'login' ? registerForm : loginForm;

    hideForm.classList.remove('active');
    showForm.classList.remove('active');

    // Force reflow for animation restart
    void showForm.offsetWidth;

    showForm.style.animation = tab === 'login' ? 'formSlideInReverse 200ms ease-out' : 'formSlideIn 200ms ease-out';
    showForm.classList.add('active');

    // Clear alerts
    loginAlert.innerHTML = '';
    registerAlert.innerHTML = '';
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabRegister.addEventListener('click', () => switchTab('register'));
  switchToRegister.addEventListener('click', () => switchTab('register'));
  switchToLogin.addEventListener('click', () => switchTab('login'));

  // ═══════════════════════════════════════════
  // PASSWORD TOGGLE
  // ═══════════════════════════════════════════
  $$('.toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');

      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        input.type = 'password';
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    });
  });

  // ═══════════════════════════════════════════
  // PASSWORD STRENGTH METER
  // ═══════════════════════════════════════════
  const regPassword = $('#regPassword');
  const strengthBars = $$('.strength-bar');
  const strengthText = $('#strengthText');

  function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }

  const strengthLabels = ['', 'WEAK', 'FAIR', 'GOOD', 'STRONG'];
  const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

  regPassword.addEventListener('input', () => {
    const val = regPassword.value;
    const score = val.length === 0 ? 0 : checkPasswordStrength(val);

    strengthBars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < score) {
        bar.classList.add('active', strengthClasses[score]);
      }
    });

    strengthText.textContent = score === 0 ? '—' : strengthLabels[score];
    strengthText.style.color = score === 0 ? '' :
      score === 1 ? 'var(--red)' :
        score === 2 ? 'var(--amber)' :
          score === 3 ? 'var(--cyan)' : 'var(--emerald)';
  });

  // ═══════════════════════════════════════════
  // ALERT SYSTEM
  // ═══════════════════════════════════════════
  function showAlert(container, type, message) {
    const iconSvg = type === 'error'
      ? '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      : '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';

    container.innerHTML = `<div class="alert-msg ${type}">${iconSvg}<span>${message}</span></div>`;

    // Auto-clear after 5 seconds
    setTimeout(() => {
      const alert = container.querySelector('.alert-msg');
      if (alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-4px)';
        alert.style.transition = 'opacity 200ms, transform 200ms';
        setTimeout(() => { container.innerHTML = ''; }, 200);
      }
    }, 5000);
  }

  // ═══════════════════════════════════════════
  // FORM VALIDATION & SUBMISSION
  // ═══════════════════════════════════════════

  // Simple in-memory user store (for demo; replace with PHP backend)
  let users = JSON.parse(localStorage.getItem('nexus_users') || '[]');

  function saveUsers() {
    localStorage.setItem('nexus_users', JSON.stringify(users));
  }

  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── LOGIN ──
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = sanitize($('#loginEmail').value.trim());
    const password = $('#loginPassword').value;
    const loginBtn = $('#loginBtn');

    if (!email || !password) {
      showAlert(loginAlert, 'error', 'All fields are required.');
      return;
    }

    if (!validateEmail(email)) {
      showAlert(loginAlert, 'error', 'Invalid email format.');
      return;
    }

    // Simulate loading
    loginBtn.classList.add('loading');

    setTimeout(() => {
      loginBtn.classList.remove('loading');

      const user = users.find((u) => u.email === email);
      if (!user) {
        showAlert(loginAlert, 'error', 'Agent not found in the system.');
        return;
      }

      // Simple password check (in real app, use PHP password_verify)
      if (user.password !== password) {
        showAlert(loginAlert, 'error', 'Invalid credentials. Access denied.');
        return;
      }

      showAlert(loginAlert, 'success', `Welcome back, Agent ${user.name}. System access granted.`);

      // Update avatar
      document.querySelector('.avatar-label').textContent = user.name.toUpperCase();
    }, 600);
  });

  // ── REGISTER ──
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = sanitize($('#regName').value.trim());
    const email = sanitize($('#regEmail').value.trim());
    const password = $('#regPassword').value;
    const confirmPassword = $('#regConfirmPassword').value;
    const registerBtn = $('#registerBtn');

    if (!name || !email || !password || !confirmPassword) {
      showAlert(registerAlert, 'error', 'All fields are required.');
      return;
    }

    if (name.length < 3) {
      showAlert(registerAlert, 'error', 'Agent name must be at least 3 characters.');
      return;
    }

    if (!validateEmail(email)) {
      showAlert(registerAlert, 'error', 'Invalid email format. Use valid address.');
      return;
    }

    if (password.length < 6) {
      showAlert(registerAlert, 'error', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert(registerAlert, 'error', 'Passwords do not match.');
      return;
    }

    // Check duplicate
    if (users.find((u) => u.email === email)) {
      showAlert(registerAlert, 'error', 'Email already registered in the system.');
      return;
    }

    // Simulate loading
    registerBtn.classList.add('loading');

    setTimeout(() => {
      registerBtn.classList.remove('loading');

      users.push({ name, email, password });
      saveUsers();

      showAlert(registerAlert, 'success', `Agent ${name} registered successfully. Proceed to login.`);

      // Clear form
      registerForm.reset();
      strengthBars.forEach((bar) => { bar.className = 'strength-bar'; });
      strengthText.textContent = '—';
      strengthText.style.color = '';

      // Auto-switch to login after delay
      setTimeout(() => switchTab('login'), 1500);
    }, 800);
  });

  // Quest tracking removed — panel no longer in use


  // ═══════════════════════════════════════════
  // INPUT FOCUS SOUNDS (Visual feedback flash)
  // ═══════════════════════════════════════════
  $$('.hud-input').forEach((input) => {
    input.addEventListener('focus', () => {
      const wrapper = input.closest('.input-wrapper');
      if (wrapper) {
        wrapper.style.filter = 'brightness(1.1)';
        setTimeout(() => { wrapper.style.filter = ''; }, 100);
      }
    });
  });

  // ═══════════════════════════════════════════
  // BUTTON CLICK FEEDBACK
  // ═══════════════════════════════════════════
  $$('.hud-btn').forEach((btn) => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.96) skewX(-1deg)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ═══════════════════════════════════════════
  // HEADER TYPING EFFECT ON LOAD
  // ═══════════════════════════════════════════
  const statusLabel = document.querySelector('.status-label');
  const originalText = statusLabel.textContent;
  statusLabel.textContent = '';

  let charIndex = 0;
  function typeStatus() {
    if (charIndex < originalText.length) {
      statusLabel.textContent += originalText[charIndex];
      charIndex++;
      setTimeout(typeStatus, 50);
    }
  }
  setTimeout(typeStatus, 300);

  // ═══════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════
  document.addEventListener('keydown', (e) => {
    // Ctrl+1 = Login tab, Ctrl+2 = Register tab
    if (e.ctrlKey && e.key === '1') {
      e.preventDefault();
      switchTab('login');
    }
    if (e.ctrlKey && e.key === '2') {
      e.preventDefault();
      switchTab('register');
    }
  });

})();
