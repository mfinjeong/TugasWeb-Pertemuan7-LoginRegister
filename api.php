<?php
session_start();
header('Content-Type: application/json');

$file = __DIR__ . '/users.json'; // Menggunakan absolute path agar lokasi file pasti

// Fungsi membaca file JSON dengan proteksi otomatis
function getUsers($file) {
    if (!file_exists($file)) {
        file_put_contents($file, '[]'); // Buat file jika belum ada
        return [];
    }
    $data = file_get_contents($file);
    $decoded = json_decode($data, true);
    
    // Jika isi file rusak/kosong, paksa kembalikan array kosong
    return is_array($decoded) ? $decoded : [];
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

// 1. REGISTRASI
if ($action === 'register') {
    $nama     = htmlspecialchars(trim($input['name'] ?? ''));
    $email    = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $password = $input['password'] ?? '';

    if (empty($nama) || empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid.']);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password minimal 6 karakter.']);
        exit;
    }

    $users = getUsers($file);

    foreach ($users as $user) {
        if (isset($user['email']) && $user['email'] === $email) {
            echo json_encode(['status' => 'error', 'message' => 'Email sudah terdaftar.']);
            exit;
        }
    }

    // Cari ID tertinggi agar ID tidak pernah bentrok
    $maxId = 0;
    foreach ($users as $u) {
        if (isset($u['id']) && $u['id'] > $maxId) {
            $maxId = $u['id'];
        }
    }

    $newUser = [
        'id'         => $maxId + 1,
        'nama'       => $nama,
        'email'      => $email,
        'password'   => password_hash($password, PASSWORD_DEFAULT),
        'created_at' => date('Y-m-d H:i:s')
    ];

    $users[] = $newUser;
    
    // Simpan ke file users.json
    $saved = file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

    if ($saved === false) {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menulis ke file users.json. Cek permission folder!']);
        exit;
    }

    echo json_encode(['status' => 'success', 'message' => 'Registrasi berhasil! Silakan login.']);
    exit;
}

// 2. LOGIN
if ($action === 'login') {
    $email      = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $password   = $input['password'] ?? '';
    $rememberMe = $input['rememberMe'] ?? false;

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi.']);
        exit;
    }

    $users = getUsers($file);
    $foundUser = null;

    foreach ($users as $user) {
        if (isset($user['email']) && $user['email'] === $email) {
            $foundUser = $user;
            break;
        }
    }

    if ($foundUser && password_verify($password, $foundUser['password'])) {
        $_SESSION['user_id']  = $foundUser['id'];
        $_SESSION['username'] = $foundUser['nama'];
        $_SESSION['email']    = $foundUser['email'];

        if ($rememberMe) {
            setcookie('nexus_user', $foundUser['email'], time() + (86400 * 30), "/");
        }

        echo json_encode([
            'status' => 'success', 
            'message' => 'Akses diterima! Mengalihkan ke dashboard...',
            'redirect' => 'dashboard.php'
        ]);
        exit;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Email atau password salah.']);
        exit;
    }
}