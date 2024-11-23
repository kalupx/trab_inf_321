<?php
session_start();
$db = new SQLite3('usuarios.db');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    $stmt = $db->prepare('SELECT * FROM usuarios WHERE email = :email');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    $usuario = $result->fetchArray();

    if ($usuario && password_verify($senha, $usuario['senha'])) {
        // Senha correta, loga o usuário
        $_SESSION['usuario'] = $email;
        echo "Login realizado com sucesso!";
        // Redireciona para a página principal ou outro local
        header('Location: index.html');
    } else {
        echo "E-mail ou senha incorretos!";
    }
}
?>
