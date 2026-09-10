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
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
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
  if (sessionIdEl) sessionIdEl.textContent = generateSessionId();

  // ── DATA STREAM ANIMATION ──
  const streamChars = '01█▓░▒▐▌├┤┬┴╫╬═║';
  function updateDataStream() {
    if (!dataStreamEl) return;
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
    if (tabLogin) tabLogin.classList.toggle('active', tab === 'login');
    if (tabRegister) tabRegister.classList.toggle('active', tab === 'register');

    // Move indicator
    if (tabIndicator) {
      tabIndicator.style.transform = tab === 'register' ? 'translateX(100%)' : 'translateX(0)';
    }

    // Switch forms with animation
    const showForm = tab === 'login' ? loginForm : registerForm;
    const hideForm = tab === 'login' ? registerForm : loginForm;

    if (hideForm) hideForm.classList.remove('active');
    if (showForm) {
      showForm.classList.remove('active');
      void showForm.offsetWidth; // Force reflow
      showForm.style.animation = tab === 'login' ? 'formSlideInReverse 200ms ease-out' : 'formSlideIn 200ms ease-out';
      showForm.classList.add('active');
    }

    // Clear alerts
    if (loginAlert) loginAlert.innerHTML = '';
    if (registerAlert) registerAlert.innerHTML = '';
  }

  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));
  if (switchToRegister) switchToRegister.addEventListener('click', () => switchTab('register'));
  if (switchToLogin) switchToLogin.addEventListener('click', () => switchTab('login'));

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
        if (eyeOpen) eyeOpen.classList.add('hidden');
        if (eyeClosed) eyeClosed.classList.remove('hidden');
      } else {
        input.type = 'password';
        if (eyeOpen) eyeOpen.classList.remove('hidden');
        if (eyeClosed) eyeClosed.classList.add('hidden');
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

  if (regPassword) {
    regPassword.addEventListener('input', () => {
      const val = regPassword.value;
      const score = val.length === 0 ? 0 : checkPasswordStrength(val);

      strengthBars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < score) {
          bar.classList.add('active', strengthClasses[score]);
        }
      });

      if (strengthText) {
        strengthText.textContent = score === 0 ? '—' : strengthLabels[score];
        strengthText.style.color = score === 0 ? '' :
          score === 1 ? 'var(--red)' :
            score === 2 ? 'var(--amber)' :
              score === 3 ? 'var(--cyan)' : 'var(--emerald)';
      }
    });
  }

  // ═══════════════════════════════════════════
  // ALERT SYSTEM
  // ═══════════════════════════════════════════
  function showAlert(container, type, message) {
    if (!container) return;
    const iconSvg = type === 'error'
      ? '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      : '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';

    container.innerHTML = `<div class="alert-msg ${type}">${iconSvg}<span>${message}</span></div>`;

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

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ═══════════════════════════════════════════
  // FORM SUBMISSION (CONNECTED TO API.PHP)
  // ═══════════════════════════════════════════

  // ── LOGIN HANDLER ──
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = $('#loginEmail').value.trim();
      const password = $('#loginPassword').value;
      const rememberMe = $('#rememberMe')?.checked || false;
      const loginBtn = $('#loginBtn');

      if (!email || !password) {
        showAlert(loginAlert, 'error', 'Semua field wajib diisi.');
        return;
      }

      if (!validateEmail(email)) {
        showAlert(loginAlert, 'error', 'Format email tidak valid.');
        return;
      }

      if (loginBtn) loginBtn.classList.add('loading');

      fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password, rememberMe })
      })
      .then(res => res.json())
      .then(data => {
        if (loginBtn) loginBtn.classList.remove('loading');

        if (data.status === 'success') {
          showAlert(loginAlert, 'success', data.message);
          setTimeout(() => {
            window.location.href = data.redirect || 'dashboard.php';
          }, 1000);
        } else {
          showAlert(loginAlert, 'error', data.message);
        }
      })
      .catch(() => {
        if (loginBtn) loginBtn.classList.remove('loading');
        showAlert(loginAlert, 'error', 'Koneksi ke server gagal.');
      });
    });
  }

  // ── REGISTER HANDLER ──
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = $('#regName').value.trim();
      const email = $('#regEmail').value.trim();
      const password = $('#regPassword').value;
      const confirmPassword = $('#regConfirmPassword').value;
      const registerBtn = $('#registerBtn');

      if (!name || !email || !password || !confirmPassword) {
        showAlert(registerAlert, 'error', 'Semua field wajib diisi.');
        return;
      }

      if (name.length < 3) {
        showAlert(registerAlert, 'error', 'Nama minimal 3 karakter.');
        return;
      }

      if (!validateEmail(email)) {
        showAlert(registerAlert, 'error', 'Format email tidak valid.');
        return;
      }

      if (password.length < 6) {
        showAlert(registerAlert, 'error', 'Password minimal 6 karakter.');
        return;
      }

      if (password !== confirmPassword) {
        showAlert(registerAlert, 'error', 'Konfirmasi password tidak cocok.');
        return;
      }

      if (registerBtn) registerBtn.classList.add('loading');

      fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (registerBtn) registerBtn.classList.remove('loading');

        if (data.status === 'success') {
          showAlert(registerAlert, 'success', data.message);
          registerForm.reset();
          
          // Reset Strength Bars UI
          strengthBars.forEach((bar) => { bar.className = 'strength-bar'; });
          if (strengthText) {
            strengthText.textContent = '—';
            strengthText.style.color = '';
          }

          // Auto pindah ke tab login setelah registrasi sukses
          setTimeout(() => switchTab('login'), 1500);
        } else {
          showAlert(registerAlert, 'error', data.message);
        }
      })
      .catch(() => {
        if (registerBtn) registerBtn.classList.remove('loading');
        showAlert(registerAlert, 'error', 'Koneksi ke server gagal.');
      });
    });
  }

  // ═══════════════════════════════════════════
  // INPUT FOCUS & BUTTON FEEDBACK
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

  $$('.hud-btn').forEach((btn) => {
    btn.addEventListener('mousedown', () => { btn.style.transform = 'scale(0.96) skewX(-1deg)'; });
    btn.addEventListener('mouseup', () => { btn.style.transform = ''; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ═══════════════════════════════════════════
  // HEADER TYPING EFFECT
  // ═══════════════════════════════════════════
  const statusLabel = document.querySelector('.status-label');
  if (statusLabel) {
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
  }

  // ═══════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════
  document.addEventListener('keydown', (e) => {
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