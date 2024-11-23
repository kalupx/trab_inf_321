<?php
$db = new SQLite3('usuarios.db');

$query = "CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
)";

if ($db->exec($query)) {
    echo "Banco de dados e tabela criados com sucesso!";
} else {
    echo "Erro ao criar banco de dados ou tabela.";
}
?>
