<template>
  <div class="overlay">
    <div class="container">
      <div class="title">About</div>
      <div class="content">
        <p>This system is created by Kit,LUNG.</p>
        <p>Its aim is to simplify and automate the procedures of students leaving school.</p>
        <div class="btn-group">
          <button class="btn primary-btn" v-on:click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'About',
  methods: {
    close () {
      this.$emit('close-message')
    }
  }
}
</script>
<style lang="scss" scoped>
  .overlay{
    position: fixed; /* Sit on top of the page content */
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
    .container{
      position: absolute;
      top: 300px;
      left: 312px;
      height: 200px;
      width: 400px;
      background-color: #111;
      padding: 0px;
      .title{
        background-color: #02ffc4;
        height: 40px;
        font-size: 20px;
        padding: 10px;
      }
      .content{
        height: 160px;
        color: #fff;
        padding: 10px;
        .btn-group{
          display: flex;
          .btn{
            border-radius: 0px;
            margin-left: auto;
            margin-right: auto;
            font-weight: 700;
          }
          .primary-btn{
            background-color: #02ffc4;
            color: #000;
          }
        }
      }
    }
  }
</style>
