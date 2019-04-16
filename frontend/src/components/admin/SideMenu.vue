<template>
  <transition name="slide">
    <div id="sideMenu" class="md-elevation-5" v-show="displaySideMenu">
      <ul class="item-list">
        <router-link to="/admin/students">
          <li class="item">
            <transition name="select-slide">
              <div class="select-bar" v-show="selected == '/admin/students'"></div>
            </transition>
            <md-icon>account_box</md-icon>
            <h6>Students</h6>
          </li>
        </router-link>
        <router-link to="/admin/currentLogs">
          <li class="item">
            <transition name="select-slide">
              <div class="select-bar" v-show="selected == '/admin/currentLogs'"></div>
            </transition>
            <md-icon>assessment</md-icon>
            <h6>Exit Records</h6>
          </li>
        </router-link>
        <router-link to="/admin/permissionLogs">
          <li class="item">
            <transition name="select-slide">
              <div class="select-bar" v-show="selected == '/admin/permissionLogs'"></div>
            </transition>
            <md-icon>assignment_ind</md-icon>
            <h6>Change History</h6>
          </li>
        </router-link>
        <router-link to="/admin/tempPermission">
          <li class="item">
            <transition name="select-slide">
              <div class="select-bar" v-show="selected == '/admin/tempPermission'"></div>
            </transition>
            <md-icon>hourglass_empty</md-icon>
            <h6>Temporary Permission</h6>
          </li>
        </router-link>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SideMenu',
  data () {
    return {
      displaySideMenu: false,
      selected: ''
    }
  },
  methods: {
    toggle () {
      this.displaySideMenu = !this.displaySideMenu
    },
  },
  beforeCreate () {
    this.displaySideMenu = false
  },
  mounted () {
    this.$root.$on('openOrCloseMenu', () => {
      this.toggle()
    })
    this.$root.$on('closeMenu', () => {
      this.displaySideMenu = false
    })
  },
  watch: {
    $route (to, from) {
      this.selected = to.path
      this.$root.$emit('closeMenu')
    }
  },
  created () {
    this.selected = this.$route.path
  }
}
</script>

<style lang="scss" scoped>
$background: #00212B;
$wrapper-background: #003c4f;
$pri-color: #02ffc4;
$sec-color: #00e2ff;

#sideMenu {
  width: 110px;
  height: 100vh;
  float: left;
  background: $background;
  overflow: auto;
  z-index: 99;
  opacity: 100;
  position: fixed;
  .item-list{
    list-style: none;
    padding: 0px;
    a{
      color: transparent;
      &:hover{
        color: transparent;
      }
    }
    .item{
      margin: 20px 0px;
      position: relative;
      .select-bar{
        height: 88px;
        position: absolute;
        width: 5px;
        background-color: $sec-color;
      }
      .md-icon{
        font-size: 50px !important;
        color: $sec-color;
        width: 50px;
        height: 50px;
      }
      h6{
        color: #fff;
        text-transform: uppercase;
      }
    }
  }
}

.slide-enter-active, .slide-leave-active{
  transition: all .5s;
}
.slide-enter, .slide-leave-to{
  transform: translateX(-110px);
  opacity: 0;
}

.select-slide-enter-active, .select-slide-leave-active{
  transition: all .5s;
}
.select-slide-enter, .select-slide-leave-to{
  transform: translateX(-5px);
  opacity: 0;
}

</style>
