<template>
  <div class="full-height home">
    <div class="full-height app-container">
      <div class="upper">
        <div class="title-bar">
            <div>Renaissance College</div>
            <b-dropdown id="ddown1" text="" class="m-md-2" right variant="dark" no-caret>
              <template slot="text"> <font-awesome-icon icon="cog" class="setting-icon"/> </template>
              <b-dropdown-item v-on:click="refresh">Refresh</b-dropdown-item>
              <b-dropdown-item v-on:click="initLog">Logs</b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item v-on:click="showDialog.about = true">About</b-dropdown-item>
            </b-dropdown>
        </div>
        <div class="student-info" v-show="this.user.fullName">
          <div class="img-wrapper" id="imageWrapper">
            <img :src="'api/photo/get-image/' + user.weblogin" v-show="user.weblogin" :class="{'success-img': successIcon}">
          </div>
          <div class="info-wrapper">
            <div class="text-wrapper">
              <div class="property">NAME</div>
              <div class="content" ref="studentName">{{ this.user.fullName }}</div>
            </div>
            <div class="text-wrapper flex" :style="{width : studentInfoCSS.lowerStudentInfoWidth + 'px'}">
              <div ref="advisoryWidth" class="lower-info">
                <div class="property">ADVISORY</div>
                <div class="content">{{this.user.advisory}}</div>
              </div>
              <div :style="{'margin-left' : studentInfoCSS.houseMargin + 'px'}" ref="houseWidth" class="lower-info">
                <div class="property">HOUSE</div>
                <div class="content">{{this.user.house}}</div>
              </div>
            </div>
            <span class="success-icon" v-show="successIcon"><md-icon>check_circle</md-icon></span>
          </div>
        </div>
        <div class="student-info" v-show="!this.user.fullName">
          <div class="school-logo-wrapper">
            <img src='https://www.rchk.edu.hk/wp-content/uploads/2016/10/rchklogo.png' class="school-logo">
          </div>
          <div class="instruction-wrapper">
            <p class="school-system-title">EXIT PASS SYSTEM</p>
            <div class="school-system-content">
              <div>
                <p class="header">Instruction</p>
                <p>1. On exit, select RETURN / LEAVE.</p>
                <p>2. Tap the reader with your smartcard.</p>
                <p>3. Wait for <span style="color: #72bb53">SUCCESS</span> or <span style="color: #f50057">FAIL</span> message to confirm.</p>
                <p>4. Press <font-awesome-icon :icon="['far', 'times-circle']" /> to finish.</p>
                <p>5. On return, tap smartcard only.</p>
                <p class="header" style="font-size: 25px;">Note: If no response, press school logo & try again.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lower flex">
        <div class="half left" v-bind:class="mode == 'exit' ? 'active' : 'unactive'" @click="changeMode('exit')">
          <div class="title-bar">
            <div class="icon-wrapper"><font-awesome-icon icon="walking" /> <font-awesome-icon icon="walking" class="flip"/></div></div>
          <div class="btn-text">RETURN
            <font-awesome-icon icon="exchange-alt" />
          </div>
        </div>
        <div class="half right" v-bind:class="mode == 'leave' ? 'active' : 'unactive'" @click="changeMode('leave')">
          <div class="title-bar">
            <div class="icon-wrapper"><font-awesome-icon icon="walking" /> <font-awesome-icon icon="walking" /></div></div>
          <div class="btn-text">LEAVE
            <font-awesome-icon icon="long-arrow-alt-right" />
          </div>
        </div>
      </div>

      <message-dialog 
        v-show="showDialog.message"
        v-bind:title="message.title"
        v-bind:content="message.content"
        @close-message="closeMessage"
      ></message-dialog>

      <about-dialog
        v-show="showDialog.about"
        @close-message="closeMessage"
      ></about-dialog>

      <log-dialog
        v-show="showDialog.log"
        @close-message="closeMessage"
        ref="logDialog"
      ></log-dialog>
      <notifications group="error" classes="vue-notification error"/>
    </div>
  </div>
</template>

<script>
import messageDialog from './Message'
import aboutDialog from './About'
import logDialog from './Log'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'Student',
  components: {
    messageDialog,
    aboutDialog,
    logDialog
  },
  data () {
    return {
      user: {
        card_id: '',
        weblogin: '',
        fullName: '',
        house: '',
        advisory: ''
      },
      tempUser: {
        card_id: '',
        weblogin: '',
        fullName: '',
        house: '',
        advisory: ''
      },
      passcode: '',
      studentInfoCSS: {
        lowerStudentInfoWidth: '0px',
        houseMargin: ''
      },
      mode: '',
      successIcon: false,
      showDialog: {
        message: false,
        about: false,
        log: false
      },
      timer: {
        message: '',
        main: ''
      },
      message: {
        title: '',
        content: ''
      },
    }
  },
  methods: {
    changeMode (mode) {
      this.mode = mode
    },
    changeInfoCSS () {
      this.studentInfoCSS.lowerStudentInfoWidth = this.$refs.studentName.clientWidth
      if (this.studentInfoCSS.lowerStudentInfoWidth <= 300) {
        this.studentInfoCSS.lowerStudentInfoWidth = 300
      }
      this.studentInfoCSS.houseMargin = this.$refs.studentName.clientWidth - this.$refs.advisoryWidth.clientWidth - this.$refs.houseWidth.clientWidth
      if (this.studentInfoCSS.houseMargin <= 80) {
        this.studentInfoCSS.houseMargin = 80
      }
    },
    showStudentInfo(){
      this.user.fullName = this.tempUser.fullName
      this.user.advisory = this.tempUser.advisory
      this.user.house = this.tempUser.house
      this.user.weblogin = this.tempUser.weblogin
      this.changeInfoCSS()
    },
    afterSwipe () {
      this.getStudent()
        .then(() => { // check duplication
          return this.checkDuplicate()
        })
        .then((res) => { // switch return or exit/leave
          if (res === 1) {
            this.studentReturn()
          } else {
            return this.studentAllowToLeave()
          }
        })
        .then((res) => { // check permission
        console.log(res)
          if (res != undefined) {
            if (this.mode !== '') { // selected mode
              if (!!res) { // allow to leave
                Promise.all([
                  this.showStudentInfo(),
                  this.studentLeaveOrExit()
                ])
                  .then(res => {
                    if (this.mode === 'exit') {
                      this.successIcon = true
                      // this.openMessageDialog('SUCCESS', 'See you later.')
                    } else {
                      this.successIcon = true
                      // this.openMessageDialog('SUCCESS', 'Goodbye.')
                    }
                  })
                  .catch(err => {
                      this.successIcon = false
                      this.openMessageDialog('ERROR', err + 'Please contact Red Door.')
                  })
              } else { // not allow
                this.successIcon = false
                this.openMessageDialog('FAIL', 'Contact SS Office for more info.')
              }
            } else { // did not select mode
              this.successIcon = false
              this.openMessageDialog('ERROR', 'Select Return / Leave.')
            }
          } else { // return
            Promise.all([
              this.showStudentInfo()
            ])
              .then(res => {
                this.successIcon = false
                this.openMessageDialog('SUCCESS', 'Welcome back.')
              })
              .catch(err => {
                  this.successIcon = false
                  this.openMessageDialog('ERROR', err + 'Please contact Red Door.')
              })
          }
          this.user.card_id = ''
        })
        .catch((error) => {
          this.user.card_id = ''
          if (error.status === 502) {
            this.$notify({
              group: 'error',
              title: 'Error',
              text: 'Bad gateway. Please try again later.'
            })
          }
        })
    },
    getStudent () {
      return new Promise((resolve, reject) => {
        if(this.user.card_id.length !== 10){
          this.openMessageDialog('ERROR', 'Card ID incorrect.')
          reject('Card id is less than 10 digit.')
        }else{
          this.$http.get('/api/exitpass/get-current-card-id/' + this.user.card_id)
            .then(res => {
              if(res.data.Error){
                this.openMessageDialog('ERROR', 'Cannot find user.')
                reject('No such user')
              }else{
                this.$http.get('/api/exitpass/get-card-details/' + res.data.Request[0].card_id)
                  .then(response => {
                    if (!response.data.Request || response.data.Request.length === 0) { // not such user
                    } else {
                      var res = response.data.Request[0]
                      this.tempUser.fullName = res.name + ' ' + res.family_name
                      this.tempUser.advisory = res.roll_group
                      this.tempUser.house = res.house
                      this.tempUser.weblogin = res.weblogin
                      resolve()
                    }
                  })
                  .catch(error => {
                    reject(error)
                  })
              }
            })
            .catch(err => {
              this.openMessageDialog('ERROR', 'Cannot find user.')
              reject('No such user')
            })

        }
      })
    },
    checkDuplicate () {
      return new Promise((resolve, reject) => {
        this.$http.get('/api/exitpass/if-exists/' + this.tempUser.weblogin)
          .then(response => {
            if (response.data.Request.length > 0) {
              this.$data.returnRowId = response.data.Request[0].id
              resolve(1)
            } else {
              resolve(0)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    studentReturn () {
      var param = {
        weblogin: this.tempUser.weblogin
      }
      this.$http.post('/api/exitpass/student-return', param)
        .catch(err => {
          console.log(err)
        })
    },
    studentLeaveOrExit () {
      return new Promise((resolve,reject) => {
        var param = {
          weblogin: this.tempUser.weblogin,
          status: this.mode
        }
        this.$http.post('/api/exitpass/add-to-exit-log', param)
          .then((res) => {
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    studentAllowToLeave () {
      var promise = this.$http.get('/api/exitpass/get-permission/' + this.tempUser.weblogin)
        .then((res) => {
          if (res.data.Request){
            if(res.data.Request[0].permission != undefined){
              return res.data.Request[0].permission
            }else{
              return 0
            }
          }else{
            return 0
          }
        })
        .catch((err) => {
          console.log(err)
        })
      return promise
    },
    openMessageDialog (title, msg) {
      this.showDialog.message = true
      this.message.title = title
      this.message.content = msg
    },
    closeMessage () {
      this.showDialog.message = false
      this.showDialog.about = false
      this.showDialog.log = false
      this.user.card_id = ''
    },
    refresh () {
      window.location.reload()
    },
    initLog () {
      this.$refs.logDialog.showLogs()
      this.showDialog.log = true
    },
    clearStudentInfo () {
      this.user = {
        card_id: '',
        weblogin: '',
        fullName: '',
        house: '',
        advisory: ''
      }
      this.successIcon = false
      clearInterval(this.timer.main)
    }
  },
  created () {
    window.addEventListener('keydown', (event) => {
      if (event.keyCode >= 48 && event.keyCode <= 57) {
        this.user.card_id += '' + (event.keyCode - 48)
      } else if (event.keyCode === 13) {
        if (!this.showDialog.message && !this.showDialog.about && !this.showDialog.log) {
          this.afterSwipe()
        } else {
          this.user.card_id = ''
        }
      }
    })
  },
  watch: {
    'showDialog.message': function (newVal, oldVal) {
      if (newVal === true) {
        this.timer.message = setInterval(() => { this.showDialog.message = false }, 2000)
      } else {
        clearInterval(this.timer.message)
      }
    },
    'user.card_id': function (newVal, oldVal) {
      if (newVal === '') {
        this.timer.main = setInterval(() => { this.clearStudentInfo() }, 5000)
      } else {
        clearInterval(this.timer.main)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$background: #00212B;
$wrapper-background: #003c4f;
$pri-color: #02ffc4;
$sec-color: #00e2ff;

  .full-height{
    height: 100%;
  }
  .center{
    margin-left: auto;
    margin-right: auto;
  }
  .app-container{
    background-color: $background;
    padding: 10px;
    input{
      opacity: 0;
      position: absolute;
    }
    .flex{
      display: flex;
    }
    .title-bar{
      font-size: 30px;
      padding: 10px;
      background-color: #000;
      color: #e7b42a;
      font-weight: 700;
      #ddown1{
        float: right;
        top: -30px;
        button{
          background-color: transparent;
        }
      }
    }

    .upper{
      background-color: $wrapper-background;
      width: 1004px;
      height: 460px;
      .title-bar{
        height: 50px;
        .btn-secondary {
          background-color: transparent !important;
        }
      }
      .student-info{
        display: flex;
        height: 410px;
        position: relative;
        .img-wrapper{
          height: 410px;
          width: 400px;
          margin: 0;
          img{
            max-height: 100%;
            max-width: 100%;
            float: left;
            &.success-img{
              border: 5px solid #72bb53;
            }
          }
        }
        .school-logo-wrapper{
          height: 410px;
          .school-logo{
            height: 410px;
          }
        }
        .info-wrapper{
          width: 670px;
          padding: 80px 40px;
          .text-wrapper{
            text-align: left;
            width: fit-content;
            max-width: 650px;
            &.flex{
              margin-top: 70px;
            }
            .property{
              font-size: 30px;
              color: $sec-color;
              font-weight: 700;
              margin-bottom: 30px;
              h4{
                margin-top: 0;
              }
            }
            .content{
              font-size: 50px;
              color: $pri-color;
              font-weight: 800;
            }
            .lower-info{
              margin-top: 30px;
            }
          }
        }
        .instruction-wrapper{
          width: 679px;
          .school-system-title{
            font-size: 60px;
            margin-top: 50px;
            margin-bottom: 40px;
            font-weight: 700;
            color: $sec-color;
          }
          .school-system-content{
            color: #fff;
            div{
              margin-top: 40px;
              text-align: left;
              padding: 20px 20px 20px 50px;
              p{
                font-size: 30px;
                height: 30px;
                margin-bottom: 10px;
              }
              .header{
                font-size: 30px;
                height: 30px;
                color: $sec-color;
              }
            }
          }
        }
        .success-icon{
          position: absolute;
          color: #72bb53;
          right: -68px;
          top: 0;
          .md-icon{
            width: 50px;
            height: 50px;
            font-size: 50px !important;
          }
        }
      }
    }
    .lower{
      width: 1004px;
      height: 278px;
      margin-top: 10px;
      .half{
        background-color: $wrapper-background;
        width: 497px;
        height: 278px;
        position: relative;
        .flip{
          transform: scaleX(-1);
        }
        .icon-wrapper{
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        &.active{
          .title-bar{
            background-color: $pri-color;
            color: #000;
          }
          .bottom-left-icon{
            color: $sec-color;
          }
          .btn-text{
            color: $pri-color;
          }
        }
        &.unactive{
          .title-bar{
            background-color: #000;
            color: $pri-color;
          }
          .bottom-left-icon{
            color: #fff;
          }
          .btn-text{
            color: #fff;
          }
        }
        .btn-text{
          font-size: 80px;
          line-height: 220px;
          font-weight: 700;
          font-awesome-icon{
            font-size: 80px;
            position: absolute;
            right: 40px;
            top: 150px;
            opacity: 0.6;
          }
        }
      }
      .left{
        margin-right: 5px;
      }
      .right{
        margin-left: 5px;
      }
    }
  }
</style>
