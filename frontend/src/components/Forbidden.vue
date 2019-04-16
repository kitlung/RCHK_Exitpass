<template>
    <div class="home center-wrapper">
        <div class='card'>
            <div class="title">
                <h3>Exit Pass System</h3>
            </div>
            <div class="btn-group">
                Forbidden.
                You are not allowed to access the webpage.
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Forbidden'
}
</script>

<style lang="scss" scoped>
$background: #00212B;
$pri-color: #00e2ff;

.home {
  background-color: $background;
  font-size: 14px;
  width: 100vw;
  height: 100vh;
  .card {
    width: 640px;
    height: 210px;
    display: block;
    background: rgba(0,0,0,0.3);
    margin-left: auto;
    margin-right: auto;
    padding: 40px;
    .btn-group{
        display: block;
        margin: auto;
        width: 80%;
        color: $pri-color;
    }

    .title {
      color: $pri-color;
      padding: 20px;
      text-align: center;
      text-transform: uppercase;
      font-weight: 200;
      font-size: 24px;
    }
  }
}


.footer {
    background: #000000;
    position: fixed;
    left : 0px;
    bottom: 0px;
    width: 100%;
    z-index: 9998;
    p {
      text-align: center;
      color: #ffffff;
    }
}
</style>
