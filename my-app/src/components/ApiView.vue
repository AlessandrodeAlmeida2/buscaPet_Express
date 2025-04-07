<template>
  <div>
    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  props: {
    endereco: String,
    infoAnimal: Object,
  },
  data() {
    return {
      map: null,
      clickedMarker: null,
    };
  },
  mounted() {
    this.geocodificarEndereco();
  },
  methods: {
    async geocodificarEndereco() {
      const url = `https://nominatim.openstreetmap.org/search?q=${this.endereco}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        this.exibirMapa(lat, lon);
      }
    },
    exibirMapa(lat, lon) {
      if (this.map) {
        this.map.setView([lat, lon], 13);
        return;
      }

      this.map = L.map('map').setView([lat, lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // ✅ Usa descrição se existir
      const popupText = this.infoAnimal?.descricao || 'Local do animal';
      L.marker([lat, lon]).addTo(this.map).bindPopup(popupText);

      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;

        if (this.clickedMarker) {
          this.map.removeLayer(this.clickedMarker);
        }

        this.clickedMarker = L.marker([lat, lng]).addTo(this.map)
          .bindPopup('Local escolhido')
          .openPopup();

        console.log('Local escolhido:', lat, lng);
      });
    },
  },
};
</script>
