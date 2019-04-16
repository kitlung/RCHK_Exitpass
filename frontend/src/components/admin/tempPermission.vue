<template>
  <div @mousedown="focusOnField" id="temp-permission">
    <div class="title">
      <h4 v-show="state == 'weblogin'">Please input weblogin ID.</h4>
      <h4 v-show="state == 'card_id'">Please tap the card.</h4>
      <h4 v-show="state == 'finish'">Please press the add button</h4>
    </div>
    <div class="card-wrapper">
      <div class="card">
        <div class="left-bar">
          <span>Smart Card</span>
        </div>
        <svg view-box="0 0 150 410" fill="#EAB200" class="svg-design yellow-curve">
          <path d="
            M 150,0
            L 0,0
            L 0,410
            L 40,410
            Q 50,70,150,0
          "/>
        </svg>
        <svg view-box="0 0 150 410" fill="#000" class="svg-design black-curve">
          <path d="
            M 140,0
            L 110,0
            Q 0,70,0,410
            L 15,410
            Q 0,70,140,0
          "/>
        </svg>
        <div class="img-wrapper">
          <img :src="'api/photo/get-image/' + photo" class="student">
          <div class="school-info">
            <img src="https://www.rchk.edu.hk/wp-content/uploads/2016/10/rchklogo.png" class="school-logo">
            <div class="school-info-text">
              <span style="font-size: 20px;">Renaissance<br>College</span><br>
              <span style="color: #EAB200">Hong Kong</span><br>
              <span>啓新書院</span>
            </div>
          </div>
        </div>
        <div class="student-info-wrapper">
          <span>NAME</span>
          <span class="info">{{student.name}}</span> 
          <span>MAZE NO.</span>
          <span class="info">{{student.maze_no}}</span>
          <span>COLLEGE ID</span>
          <input ref="weblogin_input" @focus="$event.target.select()" v-model="student.weblogin" v-show="state == 'weblogin'"/>
          <span class="info" v-show="state != 'weblogin'">{{student.weblogin}}</span>
          <span>VALID FROM</span>
          <span class="info">{{student.valid_from}}</span> <!-- rcapps_users_cardlogs.created_time -->
          <span>EXPIRES</span>
          <span class="info">{{student.expires}}</span>
          <input ref="card_id_input" @focus="$event.target.select()" v-model="student.card_id" v-show="state != 'finish'"/>
        </div>
      </div>
      <button class="pri-btn" v-show="state == 'finish'" v-on:click="createTempAccess()"><i class="material-icons">add</i></button>
    </div>
    <notifications group="error" classes="vue-notification error"/>
    <notifications group="success" classes="vue-notification success"/>
  </div>
</template>
<script>
import moment from 'moment'

export default {
    data () {
      return {
        student: {
          name: '',
          maze_no: '',
          valid_from: '',
          weblogin: '',
          card_id: '',
          expires: ''
        },
        state: 'weblogin',
        card_arr: [],
        temp_expires: '',
        photo: 'default'
      }
    },
    methods: {
      init () {
        student = {
          name: '',
          maze_no: '',
          valid_from: '',
          weblogin: '',
          card_id: ''
        }
        state = 'weblogin',
        card_arr = []
      },
      focusOnField () {
        if (this.state === 'weblogin') {
          this.$nextTick(() => this.$refs.weblogin_input.focus())
        }else if(this.state === 'card_id'){
          this.$nextTick(() => this.$refs.card_id_input.focus())
        }
      },
      getStudentInfo () {
        this.$http.get('/api/user/'+this.student.weblogin)
          .then(res => {
            if (res.data.error) {
              this.$notify({
                group: 'error',
                title: 'Error',
                text: response.data.message
              })
            } else {
              if (res.data.response != null && res.data.response.length == 1) {
                this.student.name = res.data.response[0].full_name
                this.student.maze_no = res.data.response[0].staff_key
                this.temp_expires = res.data.response[0].card_expires
                this.state = 'card_id'
                this.photo = this.student.weblogin
                this.$nextTick(() => this.$refs.card_id_input.focus())
                this.getStudentCard()
              } else {
                this.state = 'weblogin'
                this.student = {
                  name: '',
                  maze_no: '',
                  valid_from: '',
                  weblogin: '',
                  card_id: ''
                }
                this.$notify({
                  group: 'error',
                  title: 'Error',
                  text: 'Invalid weblogin ID.'
                })
              }
            }
          })
      },
      getStudentCard () {
        this.$http.post('/api/smartcard/cardlog/get-card', {weblogin: this.student.weblogin})
          .then(res => {
            this.card_arr = [].concat(res.data.result)
          })
      },
      verifyStudentCard () {
        var res = this.card_arr.filter(card => card.card_id === this.student.card_id)
        var current_card = this.card_arr.filter(card => card.current_card == '1')[0]
        if (res.length != 0) {
          if (res.length > 1) { // more than one card (same ID)
            res = res.sort((a,b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
          }
          this.student.valid_from = moment(res[0].created_time).format("MMM YYYY")
          if (res[0].card_id == current_card.card_id) {
            this.student.expires = this.temp_expires
          }else {
            this.student.expires = moment(current_card.created_time).format("MMM YYYY")
          }
          this.state = 'finish'
        }else{
          this.state = "card_id"
          this.student.card_id = ''
          this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Invalid card or this card does not belong to this student.'
          })
        }
      },
      createTempAccess () {
        var payload = {
          card_id: this.student.card_id,
          weblogin: this.student.weblogin
        }
        this.$http.post('/api/exitpass/temp-access',payload)
          .then(res => {
            if(res.data.Error){
              this.$notify({
                group: 'error',
                title: 'Error',
                text: 'Cannot generate temporary access. Please try again later.'
              })
            }else{
              this.$notify({
                group: 'success',
                title: 'Success',
                text: 'Temporary access generated.'
              })
            }
          })
          .catch(err => {
            this.$notify({
              group: 'error',
              title: 'Error',
              text: err
            })
          })
      }
    },
    created () {
      window.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) {
          if (this.state === 'weblogin'){
            this.getStudentInfo()
          } else if (this.state === 'card_id' && this.student.card_id != '') {
            this.verifyStudentCard()
          }
        }
      })
    }
}
</script>
<style lang="scss" scoped>
  #temp-permission{
    height: 100%;
    .title{
      background-color: #00212B;
      border-radius: 10px;
      width: 70%;
      margin-left: auto;
      margin-right: auto;
      padding: 20px 0;
      color: #00e2ff;
      h4{
        margin: 0;
      }
    }
    .card-wrapper{
      height: 410px;
      width: 650px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .card{
        border-radius: 10px;
        box-shadow: 1px 1px 30px 1px #ccc;
        position: relative;
      }
      .left-bar{
        background-color: #000;
        height: 410px;
        width: 35px;
        border-radius: 10px 0 0 10px;
        span{
          color: #fff;
          transform: rotate(180deg);
          writing-mode: vertical-lr;
          height: 390px;
          font-size: 23px;
          text-align: left;
        }
      }
      .svg-design{
        position: absolute;
        height: 100%;
      }
      .yellow-curve{
        left: 35px;
        width: 150px;
      }
      .black-curve{
        left: 75px;
        width: 140px;
      }
      .img-wrapper{
        position: absolute;
        height: 410px;
        left: 35px;
        width: 40%;
        padding: 25px 20px;
        display: grid;
        grid-template-rows: 70% 30%;
        .student{
          height: 240px;
          float: left;
        }
        .school-info{
          display: flex;
          .school-logo{
            height: 90px;
            float: left;
            margin: auto 0;
          }
          .school-info-text{
            width: 80%;
            text-align: left;
            padding: 10px;
          }
        }
      }
      .student-info-wrapper{
        height: 350px;
        width: calc(60% - 35px);
        position: absolute;
        left: 295px;
        text-align: left;
        padding-top: 25px;
        padding-bottom: 15px;
        font-size: 20px;
        display: grid;
        .info{
          font-size: 24px;
          font-weight: 700;
        }
        input{
          border: 0;
          outline: none;
          font-size: 24px;
          font-weight: 700;
          height: 29px;
        }
      }
    }
    .pri-btn{
      cursor: pointer;
      position: absolute;
      border-radius: 50% 50%;
      height: 60px;
      width: 60px;
      border: 0;
      background-color: #72bb53;
      color: #fff;
      bottom: -30px;
      right: -30px;
      line-height: 0px;
    }
  }
</style>