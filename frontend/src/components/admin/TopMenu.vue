<template>
  <div id="topMenu" class="md-elevation-5">
    <div v-on:click="openMenu" class="open-menu">
      <md-icon >list</md-icon>
    </div>
    <div class="title">Exit Pass System</div>
  </div>
</template>

<script>
export default {
  name: 'TopMenu',
  methods: {
    openMenu () {
      this.$root.$emit('openOrCloseMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
$background: #00212B;
$wrapper-background: #003c4f;
$pri-color: #02ffc4;
$sec-color: #00e2ff;

#topMenu {
  background: $background;
  width: 100%;
  padding: 5px;
  height: 50px;
  .open-menu {
    text-align: left;
    float: left;
    cursor: pointer;
    margin-left: 10px;
    color: $pri-color;
    i{
      font-size: 40px !important;
      height: 40px;
      width: 40px;
    }
  }
  .title{
    float: right;
    color: #02ffc4;
    font-size: 20px;
    padding: 10px;
  }
}

.home {
    float: right;
    text-align: right;
    margin-right: 50px;
    color: #fff;
    position: relative;
    top: 12px;
    cursor: pointer;
  }


.button {
  float: right;
}

</style>
