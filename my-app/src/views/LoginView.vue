<template>
    <div class="container-login">
        <div class="input">
            <h1>Entrar</h1>
            <v-sheet class="mx-auto" width="300">
            <v-form class="form" v-model="valid">

                <v-text-field
                    v-model="email"
                    label="E-mail"
                    hide-details
                    required
                    variant="solo-filled"
                ></v-text-field><br>

                <v-text-field
                    v-model="password"
                    :counter="10"
                    type="password"
                    label="Senha"
                    hide-details
                    required
                    variant="solo-filled"
                ></v-text-field>

            </v-form>
            </v-sheet>
            <div class="buttonContainer">
                <v-btn rounded="lg" color="hsla(160, 100%, 37%, 1)" @click="signIn">Entrar</v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

// Login do usuário
async function signIn() {
  try {
    const { data: session, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.error('Erro no login:', error.message);
      errorMessage.value = 'E-mail ou senha incorretos'; // Mensagem amigável
      window.alert(errorMessage.value);
      return;
    }

    if (session) {
      // Salva o token no localStorage
      localStorage.setItem('accessToken', session.session.access_token);
      console.log('Login bem-sucedido, token salvo:', session.session.access_token);

      // Redireciona para a página principal
      router.push('/home');
    }
  } catch (err) {
    console.error('Erro inesperado no login:', err.message);
    errorMessage.value = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
    window.alert(errorMessage.value);
  }
}

// Logout do usuário
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro no logout:', error.message);
      return;
    }

    // Remove o token do localStorage
    localStorage.removeItem('accessToken');
    console.log('Logout bem-sucedido');
    router.push('/login'); // Redireciona para a tela de login
  } catch (err) {
    console.error('Erro inesperado ao tentar sair:', err.message);
  }
}
</script>

<style>
.container-login h1 {
    color: var(--primary-color);
    margin: 16px;
}

.container-login .form {
    background-color: var(--background-color);
}

div.input {
    display: flex;
    flex-direction: column;
}

.input {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 60px 0;
    text-decoration: none;
}

@media (max-width: 768px) {
    div.container-login {
        margin: 0 auto;
    }
}
</style>