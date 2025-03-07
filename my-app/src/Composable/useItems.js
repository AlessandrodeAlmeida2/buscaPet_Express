import { ref, watch } from 'vue'

export default function useItems(initialCategoria) {
  const items = ref([])
  const categoria = ref(initialCategoria)
  const loading = ref(false); // Add a loading state
  const error = ref(null); // Add an error state

  async function getItems() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('https://api-express-sand.vercel.app/dados');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (categoria.value !== ' ') {
        items.value = data.filter((item) => item.situation === categoria.value);
      } else {
          items.value = data;
      }
    } catch (err) {
      console.error('Error fetching or processing data:', err);
      error.value = err;
      items.value = []; // Reset items on error
    } finally {
      loading.value = false;
    }
  }

  watch(categoria, getItems);

  return { items, categoria, getItems }
}
