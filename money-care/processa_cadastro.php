<?php
session_start();
$db = new SQLite3('usuarios.db');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $senha_confirmacao = $_POST['senha_confirmacao'] ?? '';

    if ($senha !== $senha_confirmacao) {
        echo "As senhas não coincidem!";
        exit;
    }

    // Valida o e-mail (regex simples para formato de e-mail)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "E-mail inválido!";
        exit;
    }

    // Verifica se o e-mail já está cadastrado
    $stmt = $db->prepare('SELECT * FROM usuarios WHERE email = :email');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    if ($result->fetchArray()) {
        echo "E-mail já cadastrado!";
        exit;
    }

    // Gera o hash da senha
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    // Insere o novo usuário no banco de dados
    $stmt = $db->prepare('INSERT INTO usuarios (email, senha) VALUES (:email, :senha)');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $stmt->bindValue(':senha', $senha_hash, SQLITE3_TEXT);

    if ($stmt->execute()) {
        echo "Cadastro realizado com sucesso!";
        header("Location: login.html");
        exit;
    } else {
        echo "Erro ao cadastrar o usuário!";
    }
}
?>
