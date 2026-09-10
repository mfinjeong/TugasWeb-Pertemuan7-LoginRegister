<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>VEIYL AUTH // DASHBOARD</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="scanline-overlay"></div>
  <div class="grid-bg"></div>

  <header class="hud-header">
    <div class="header-left">
      <div class="system-status">
        <span class="status-dot online"></span>
        <span class="status-label">SESSION ACTIVE</span>
      </div>
    </div>
    <div class="header-center">
      <div class="nexus-brand">
        <span class="brand-text">VEIYL<span class="brand-accent">DASHBOARD</span></span>
      </div>
    </div>
    <div class="header-right">
      <a href="logout.php" class="hud-btn primary" style="padding: 6px 12px; font-size:0.75rem; text-decoration:none; border-color:var(--red); background:var(--red-glow); color:var(--red);">LOGOUT</a>
    </div>
  </header>

  <main class="hud-main">
    <section class="auth-panel" style="max-width:600px;">
      <div class="auth-container">
        <div class="hud-card" style="border:1px solid var(--border-muted); background:var(--bg-card); padding:24px;">
          <h1 class="form-title" style="color:var(--cyan); margin-bottom:12px;">AGENT PROFILE</h1>
          <p class="form-subtitle" style="margin-bottom:20px;">STATUS: AUTHORIZED ACCESS</p>
          
          <div style="font-family:var(--font-mono); font-size:0.9rem; display:flex; flex-direction:column; gap:12px;">
            <div><span style="color:var(--text-muted);">USER ID:</span> #<?= $_SESSION['user_id'] ?></div>
            <div><span style="color:var(--text-muted);">CODENAME:</span> <?= htmlspecialchars($_SESSION['username']) ?></div>
            <div><span style="color:var(--text-muted);">EMAIL:</span> <?= htmlspecialchars($_SESSION['email']) ?></div>
          </div>
        </div>
      </div>
    </section>
  </main>
</body>
</html>