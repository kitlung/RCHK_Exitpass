<template>
    <div class='home'>
        <TopMenu/>
        <SideMenu/>
        <transition name="fade">
          <div class="overlay" v-show="showOverlay" v-on:click="closeOverlay"></div>
        </transition>
        <div class="router-wrapper">
            <router-view></router-view>
        </div>
        <footer class="footer">
            <p>Copyright © Red Door Center 2018</p>
        </footer>

    </div>
</template>

<script>
import TopMenu from './TopMenu'
import SideMenu from './SideMenu'

export default {
  name: 'Initial',
  components: {
    TopMenu,
    SideMenu
  },
  data () {
    return {
      showOverlay: false
    }
  },
  methods: {
    closeOverlay () {
      this.$root.$emit('closeMenu')
    }
  },
  mounted () {
    this.$root.$on('openOrCloseMenu', () => {
      this.showOverlay = !this.showOverlay
    })
    this.$root.$on('closeMenu', () => {
      this.showOverlay = false
    })
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  width: 100%;
  height: 100%;
  z-index: 98;
  background-color: rgba(0,0,0,0.5);
  top: 0;
  left: 0;
  position: fixed;
}

.home {
    color: black;
    overflow: auto;
    position: fixed;
    height: 100%;
    top: 0px;
    bottom: 90px;
    left:0;
    right:0;
}

.router-wrapper{
    height: calc(100% - 50px - 36px);
    padding: 20px;
    background-color: #eee;
}

TopMenu {
    padding: 0%;
}

.title {
    background: rgba(227, 178, 73, 1);
    position: fixed;
}

img {
    position: relative;
    height: 45px;
    float: left;
    vertical-align: middle;
    border: 0px;
    -webkit-box-direction: normal;
    box-sizing: border-box;
}

.menu {
    position: relative;
    width: 250px;
}

.md-dialog {
    background-color: #ffffff;
}

.button{
    right: 15px;
    top: 5px;
    float: right;
    position: absolute;
}

.reportButton{
    position: relative;
    bottom: 10px;
}

.md-title{
    align-self: center;
    padding-right: 130px;
}

.footer {
    background: #000000;
    position: fixed;
    left : 0px;
    bottom: 0px;
    width: 100%;
    z-index: 9998;
    height: 36px;
}

.footer > p {
    text-align: center;
    color: #ffffff;
}

.fade-enter-active, .fade-leave-active{
  transition: all .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
