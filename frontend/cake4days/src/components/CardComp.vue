<template >
    <div>
        <div class="card">
                <img :src="catalogue?.imageUrl" alt="">
            <h2>Price:R{{ catalogue?.price }}</h2>
            <p>{{catalogue?.description }}</p>

            <div>
                <button @click="showmore">SHOW MORE</button>
               <button @click="addToCart">ADD TO CART</button>

      </div>
    </div>
  </div>

                
          
</template>
<script>
export default {
    props:['catalogue'],
    methods: {
        showmore(){
            alert("More details about the product will be available soon!");
        },
        addToCart() {
      this.$router.push({
        path: '/cart',
        query: {
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          quantity: 1,
          imageUrl: this.product.imageUrl

        }
      });
    },
}
}
</script>
<style  >
    img{
    width:400px;
    object-fit: cover;
 }
 .card{
    width: 400px;
    border: 20px black solid;
    border-radius:10px;
 }
</style>