<template>
  <div class="overlay">
    <div class="card">
      <div class="title">
        <div class="nav-tab-group">
          <button class="nav-tab" v-on:click="selectedTab = 'return'" v-bind:class="selectedTab == 'return' ? 'active' : 'unactive'">Return</button>
          <button class="nav-tab" v-on:click="selectedTab = 'leave'" v-bind:class="selectedTab == 'leave' ? 'active' : 'unactive'">Leave</button>
          <input class="search-filed" v-model="filter"/>
          <span class="close-btn" v-on:click="close">&times</span>
        </div>
      </div>
      <div class="content" v-show="selectedTab == 'return'">
        <b-table 
          striped
          hover
          :items="logData['exit']"
          :fields="fields"
          :filter="filter"
        ></b-table>
      </div>
      <div class="content" v-show="selectedTab == 'leave'">
        <b-table
          striped
          hover
          :items="logData['leave']"
          :fields="fields"
          :filter="filter"
        ></b-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Log',
  data () {
    return {
      logData: {
        'leave': [],
        'exit': []
      },
      fields: [
        { key: 'weblogin', sortable: true },
        { key: 'status', sortable: true },
        { key: 'leave_time', sortable: true },
        { key: 'return_time', sortable: true }
      ],
      filter: '',
      selectedTab: 'return'
    }
  },
  methods: {
    close () {
      this.device_name = ''
      this.device_key = ''
      this.resetLogs()
      this.$emit('close-message')
    },
    showLogs () {
      this.$http.get('/api/exitpass/get-exit-log/')
        .then(response => {
          response.data.Request.forEach(student => {
            var leaveDate = student.leave_time.split('T')[0]
            var leaveTime = student.leave_time.split('T')[1].split('.')[0]
            student.leave_time = leaveDate + ' ' + leaveTime
            if (student.return_time) {
              var returnDate = student.return_time.split('T')[0]
              var returnTime = student.return_time.split('T')[1].split('.')[0]
              student.return_time = returnDate + ' ' + returnTime
            }
            if (student.status === 'leave') {
              this.logData['leave'].push(student)
            } else {
              this.logData['exit'].push(student)
            }
            console.log(this.logData)
          })
        })
        .catch(error => {
          alert('log error' + error)
        })
    },
    resetLogs () {
      this.logData['leave'] = []
      this.logData['exit'] = []
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
    .card{
      height: 600px;
      width: 800px;
      left: 112px;
      top: 84px;
      background-color: #fff;
      .title{
        height: 50px;
        background-color: black;
        .nav-tab-group{
          height: 40px;
          margin-top: 10px;
          margin-left: 10px;
          .search-filed{
            outline: none;
            border: 0;
            height: 30px;
            width: 350px;
            padding-left: 5px;
          }
          .nav-tab{
            height: 40px;
            background-color: #fff;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            width: 80px;
            border: none;
            float: left;
            &.active{
              background-color: #02ffc4;
              color: #000;
            }
            &.unactive{
              background-color: #000;
              color: #02ffc4;
            }
          }
        }
        .close-btn{
          color: #02ffc4;
          font-size: 30px;
          margin: 10px;
          float: right;
        }
      }
      .content{
        padding: 5px;
        overflow: auto;
      }
    }
  }
</style>