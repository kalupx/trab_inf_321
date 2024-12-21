const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const usernameField = document.getElementById('username-field');
const confirmPasswordField = document.getElementById('confirm-password-field');
const forgotPasswordText = document.getElementById('forgot-password-text');
const formButton = document.querySelector('form button');
const form = document.querySelector('#form');
const usernameInput = document.querySelector("#username");
let isSingUp = false; 

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    usernameField.style.display = 'none';
    confirmPasswordField.style.display = 'none';
    forgotPasswordText.style.display = 'block';
    formButton.textContent = 'Login';
    form.setAttribute('action', '/valida_login');
    isSingUp = false; 
    usernameInput.removeAttribute('required');
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    usernameField.style.display = 'block';
    confirmPasswordField.style.display = 'block';
    forgotPasswordText.style.display = 'none';
    formButton.textContent = 'Signup';
    form.setAttribute('action', '/valida_cadastro');
    isSingUp = true; 
    usernameInput.setAttribute('required', '');
});

form.addEventListener('submit', function (event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Verifica se as senhas são iguais
    if (password !== confirmPassword && isSingUp) {
        event.preventDefault();
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return false;
    }
});