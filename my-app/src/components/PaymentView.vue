<template>
  <section class="showcase">
    <div class="showcase with-title">
      <h2 class="title">Impulsionar publicação</h2>
      <p>O meio de pagamento está em modo de teste e para simular um pagamento siga as instruções abaixo:</p>
      <p>Use esse número de cartão: 4242424242424242</p>
      <p>Em código de segurança use quaisquer 3 dígitos</p>
      <p>E em validade um data futura.</p>
      <div class="img">
        <img src="" alt="" srcset="" />
      </div>
    </div>
  </section>

  <div class="nes-field mt">
    <stripe-pricing-table :pricing-table-id="pricingTableId"
                          :publishable-key="publishableKey">
    </stripe-pricing-table>
    

    <button @click="goToRead" class="prosseguir__botao">
      Prosseguir sem impulsionar
    </button>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; 

export default {
  name: 'PaymentView',
  setup() {
    const publishableKey = ref(import.meta.env.VITE_STRIPE_KEY);
    const pricingTableId = ref('prctbl_1Q0S4JKaU1Vv323oYYb3E03u');
    
    const router = useRouter(); 

    const goToRead = () => {
      router.push('/read'); 
    };

    onMounted(() => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;
      document.body.appendChild(script);
    });

    return {
      publishableKey,
      pricingTableId,
      goToRead 
    };
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 2.0em;
}

.showcase p {
  margin: 0 auto;
}

.prosseguir__botao {
  display: block; 
  margin: 16px auto; 
  padding: 12px 24px; 
  background-color: var(--primary-color);
  color: white; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  text-align: center; 
  width: 200px; 
  height: 70px; 
}

</style>
