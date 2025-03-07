<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const item = ref(null);
    const itemId = ref('');
    const userId = ref('');
    const getId = ref('');
    const results = ref('');
    const categoria = ref('');
    const router = useRouter();

    // Função para obter o usuário atual pela API Express
    async function seeCurrentUser() {
      try {
        const response = await fetch('https://api-express-sand.vercel.app/current-user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Ajuste se necessário
            'Content-Type': 'application/json',
          },
        });
        console.log('Token de autenticação:', localStorage.getItem('accessToken'));

        if (response.ok) {
          const data = await response.json();
          console.log('User ID:', data.userId);
          userId.value = data.userId;
        } else {
          console.error('Erro ao recuperar usuário:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    // Função para obter itens pela API Express
    async function getItems() {
      try {
        let url = `https://api-express-sand.vercel.app/dados?user_id=${userId.value}`;
        if (categoria.value) {
          url += `&situation=${categoria.value}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          results.value = data;
        } else {
          console.error('Erro ao buscar itens:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    watch(categoria, getItems);

    // Função para atualizar um item
    async function updateItem() {
      try {
        const response = await fetch(`https://api-express-sand.vercel.app/dados/${itemId.value}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nameUser: item.value.nameUser,
            cel: item.value.cel,
          }),
        });

        if (response.ok) {
          console.log('Item atualizado com sucesso');
          router.push('/read');
        } else {
          console.error('Erro ao atualizar item:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    // Função para deletar um item e remover sua imagem
    async function deleteItem(id) {
      try {
        const response = await fetch(`https://api-express-sand.vercel.app/delete-item/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('Item e imagem deletados com sucesso');
          getItems(); // Atualiza a lista após exclusão
        } else {
          console.error('Erro ao deletar item:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    // Função para obter detalhes de um item específico
    async function getItem(id) {
      try {
        const response = await fetch(`https://api-express-sand.vercel.app/dados/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Item obtido:', data);
          getId.value = data;
          router.push({ name: 'upload', params: { getId: id } });
        } else {
          console.error('Erro ao obter item:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    // Configurações ao montar o componente
    onMounted(async () => {
      await seeCurrentUser();
      await getItems();

      // Busca informações adicionais do usuário pela API Express
      try {
        const response = await fetch(`https://api-express-sand.vercel.app/usuario/${userId.value}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          item.value = data;
          console.log(item.value);
        } else {
          console.error('Erro ao buscar informações do usuário:', await response.json());
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    });

    // Funções auxiliares para navegação
    function updatePost(id) {
      itemId.value = id;
      router.push({ name: 'update', params: { itemId: itemId.value } });
    }

    function getItemDetails(id) {
      getId.value = id;
      router.push({ name: 'upload', params: { getId: getId.value } });
    }

    return {
      item,
      results,
      seeCurrentUser,
      updatePost,
      deleteItem,
      updateItem,
      getItemDetails,
    };
  },
};
</script>

<template>
  <div class="container-account">
    <div v-if="item">
      <h2>Dados do usuário</h2>
        <v-sheet class="mx-auto" width="300">
            <v-form class="form">

                <v-text-field
                for="nameUser"
                id="nameUser"
                label="Nome"
                v-model="item.nameUser"
                variant="solo-filled"
                ></v-text-field>

                <v-text-field
                    label="Celular"
                    v-model="item.cel"
                    hide-details
                    variant="solo-filled"
                ></v-text-field><br>
                
            </v-form>
        </v-sheet>
        <div class="btn-update">
            <v-btn rounded="lg" color="hsla(160, 100%, 37%, 1)" @click="updateItem">Atualizar</v-btn>
        </div>
    </div>

        <div class="post" v-if="results">
          <h2>Dados da postagem</h2>
          <ul>
              <li v-for="result in results" :key="result.user_id">
                <a @click="getItem(result.id)">
                  <img :src="result.photo_url" alt="Image" />
                  <h4>ATUALIZAR FOTO</h4>
                </a> 
                  <div class="bottons">
                    <v-btn rounded="lg" dark color="hsla(160, 100%, 37%, 1)" @click="() => deleteItem(result.id)">Deletar</v-btn>
                    <v-btn rounded="lg" dark color="hsla(160, 100%, 37%, 1)" @click="() => updatePost(result.id)">Atualizar</v-btn>
                  </div>
              </li>
          </ul>
      </div>
    </div>
</template>

<style>
.container-account h2 {
  color: hsla(160, 100%, 37%, 1);
  text-align: center;
  margin: 30px 0 15px 0;
  animation: zoomIn 3s ease forwards;
  animation-delay: 1s;
  visibility: hidden;
}

.container-account .form {
  animation: rotate 2s ease forwards;
  background-color: var(--background-color);
}

.container-account ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.container-account li {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100%;
  animation: zoomIn 3s ease forwards;
  
}

.container-account li img {
  border-radius: 15px;
  width: 235px;
}

.container-account li a {
  display: flex;
  flex-direction: column;
  background: hsla(160, 100%, 37%, 1);
  border: 5px solid hsla(160, 100%, 37%, 1);
  border-radius: 20px;
  color: #fff;
}

.container-account li h4 {
  text-align: center;
  margin: 5px;
}

.container-account li .bottons {
  display: flex;
  flex-direction: row;
  margin-bottom: 50px;
}

.container-account .btn-update {
  animation: zoomIn 4s ease forwards;
}

@media (max-width: 768px) {
.container-account {
  margin: 5% auto;
}

  .container-account ul {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container-account li {
    width: 80%;
  }

  .container-account li img {
    width: 100%;
  }

  .container-account li .bottons {
  display: flex;
  flex-direction: column;
  }

  .container-account .v-btn {
    margin: 5px 15%;
  }
  
}

</style>