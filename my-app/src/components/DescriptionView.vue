<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet-routing-machine'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Corrige o caminho das imagens
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const route = useRoute()
const getId = route.params.getId

const item = ref(null)
const userPhone = ref('')
const nameUser = ref('')
const userId = ref(null)
const latitude = ref(null)
const longitude = ref(null)

async function seeUser() {
  try {
    const response = await fetch(`https://api-express-sand.vercel.app/dados/${getId}`)

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário')
    }

    const data = await response.json()

    if (data && data.length > 0) {
      userId.value = data[0].user_id
    } else {
      console.log('Nenhum dado encontrado')
    } 
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
}

async function seePhoneUser() {
  try {
    const response = await fetch(`https://api-express-sand.vercel.app/user-profile/${userId.value}`)

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário')
    }

    const data = await response.json()

    if (data && data.length > 0) {
      userPhone.value = data[0].cel 
    } else {
      console.log('Nenhum dado encontrado')
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
}

async function seeNameUser() {
  try {
    const response = await fetch(`https://api-express-sand.vercel.app/user-profile/${userId.value}`)

    if (!response.ok) {
      throw new Error('Erro ao buscar nome do usuário')
    }

    const data = await response.json()

    if (data && data.length > 0) {
      nameUser.value = data[0].nameUser
    } else {
      console.log('Nenhum dado encontrado')
    }
  } catch (error) {
    console.error('Erro ao buscar nome do usuário:', error)
  }
}

onMounted(async () => {
  const response = await fetch(`https://api-express-sand.vercel.app/dados/${getId}`)
  const data = await response.json()
  if (data && data.length > 0) {
    item.value = data[0]
    latitude.value = item.value.latitude
    longitude.value = item.value.longitude
    await seeUser()
    await seePhoneUser()
    await seeNameUser()

    setTimeout(() => {
      if (latitude.value && longitude.value) {
        const map = L.map('map-view').setView([latitude.value, longitude.value], 14)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map)

        L.marker([latitude.value, longitude.value]).addTo(map)
          .bindPopup('Local onde foi encontrado/visto')
          .openPopup()

        navigator.geolocation.getCurrentPosition(position => {
          const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
          const animalLatLng = L.latLng(latitude.value, longitude.value);

          L.Routing.control({
            waypoints: [userLatLng, animalLatLng],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            show: false,
            createMarker: () => null
          }).addTo(map)

          const routingContainer = document.querySelector('.leaflet-routing-container')
          if (routingContainer) {
            routingContainer.remove()
          }
        }, error => {
          console.error('Erro ao acessar localização do usuário:', error)
        })
      }
    }, 300)
  }
})
</script>

<template>
  <div class="container-description" v-if="item">
    <h1>{{ item.situation }}</h1>
    <img :src="item.photo_url" alt="Imagem" />
    
    <div class="text-description">
      Situação: {{ item.situation }}<br>
      Nome: {{ item.name }}<br>
      Gênero: {{ item.genero }}<br>
      Espécie: {{ item.specie }}<br>
      Descrição:<br>
      {{ item.description }}<br>
      Cidade: {{ item.city }}<br>
      Recompensa: {{ item.recompensa }}<br>

      <div v-if="latitude && longitude" class="mt-4">
        Localização aproximada:<br>
      </div>

      <div id="map-view" style="height: 300px; margin-top: 16px; border-radius: 8px;"></div>

      <div class="text-center mt-4">
        <v-menu transition="fab-transition">
          <template v-slot:activator="{ props }">
            <v-btn
              color="hsla(160, 100%, 37%, 1)"
              dark
              v-bind="props"
            >
              contato
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                Nome: {{ nameUser }}
              </v-list-item-title>
              <v-list-item-title>
                celular: {{ userPhone }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
  <div v-else>
    Carregando...
  </div>
</template>

<style scoped>
#map-view {
  width: 100%;
  height: 300px;
}

.leaflet-routing-container {
  display: none !important;
}

.container-description {
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: rgba(218, 218, 218, 0.322);
    padding-bottom: 30px;
    padding-top: 50px;
}

.container-description h1 {
  color: hsla(160, 100%, 37%, 1);
  animation: zoomIn 3s;
}

.container-description img {
    width: 400px;
    margin: 20px;
    animation: rotateY 3s;
    border-radius: 15px;
    border: 10px solid hsla(160, 100%, 37%, 1);
}

.text-description {
  width: 400px;
}

@media (max-width: 768px) {
div.container-description img {
  width: 80%;
  margin: 5% auto;
}

.text-description {
  width: 80%;
  margin: 5% auto;
}
}
</style>
