<template>
    <div class="logs">
      <div class="card title-card">
        <div class="title-card-content">
          <h1 class="title">Exit Records</h1>
          <div class="btn-group">
            <button class="action-btn" @click="getLogs"><md-icon class="btn-icon">refresh</md-icon><label>Refresh</label></button>
            <button class="action-btn" @click="showCSV = !showCSV"><md-icon class="btn-icon">input</md-icon><label>Export CSV</label></button>
          </div>
        </div>
      </div>
      <transition name="show-csv-card">
        <div class="card csv-card" v-show="showCSV">
          <div class="csv-card-content">
            <div class="date-picker-wrapper">
              <p class="date-label" v-bind:class="{'fail': date.start.err}">From</P>
              <md-icon class="date-icon" v-bind:class="{'fail': date.start.err}">calendar_today</md-icon>
              <datepicker v-model="date.start.date" :input-class="'date-input'" placeholder="Start Date"></datepicker>
            </div>
            <div class="date-picker-wrapper">
              <p class="date-label" v-bind:class="{'fail': date.end.err}">To</P>
              <md-icon class="date-icon" v-bind:class="{'fail': date.end.err}">calendar_today</md-icon>
              <datepicker v-model="date.end.date" :input-class="'date-input'" placeholder="End Date"></datepicker>
            </div>
            <div class="btn-group">
              <button class="action-btn" @click="getCSVData"><md-icon class="btn-icon">input</md-icon><label>Export</label></button>
              <button class="action-btn" @click="showCSV = false"><md-icon class="btn-icon">cancel</md-icon><label>Cancel</label></button>
            </div>
          </div>
        </div>
      </transition>
      <div class="card table-card" v-bind:class="showCSV ? 'collapse' : ''">
        <log-table ref="logTable"></log-table>
      </div>
      <notifications group="error" classes="vue-notification error"/>
      <notifications group="success" classes="vue-notification success"/>
    </div>
</template>

<script>
import logTable from './LogTable'
import Datepicker from 'vuejs-datepicker'

export default {
  name: 'currentLogs',
  components: {
    logTable,
    Datepicker
  },
  data () {
    return {
      showCSV: false,
      date: {
        start: {
          date: new Date(),
          err: false
        },
        end: {
          date: new Date(),
          err: false
        }
      }
    }
  },
  methods: {
    getLogs () {
      this.$refs.logTable.getLogs()
    },
    getCSVData () {
      if (!this.date.start.err && !this.date.start.err) {
        var start = this.date.start.date.toISOString().split('T')[0]
        var end = this.date.end.date
        end = new Date(end.setDate(end.getDate() + 1)).toISOString().split('T')[0]
        var payload = {
          start: start,
          end: end
        }
        this.$http.post('/api/exitpass/get-records-btw-dates',payload)
          .then((res) => {
            if (res.data.Error) {
              this.$notify({
                group: 'error',
                title: 'Error',
                text: 'Cannot get records.'
              })
            } else {
              var csv = res.data.Request
              this.createCSV(csv)
            }
          })
          .catch((err) => {
            this.$notify({
              group: 'error',
              title: 'Error',
              text: err
            })
          })
      }
    },
    createCSV (csv) {
      var header = 'id,last name,prefer name,weblogin,status,leave time,return time\n'
      var row = ''
      csv.forEach(ele => {
        var leave_time = ele.leave_time.split('T')[0] + ' ' + ele.leave_time.split('T')[1].split('.')[0]
        if (ele.return_time) {
          var return_time = ele.return_time.split('T')[0] + ' ' + ele.return_time.split('T')[1].split('.')[0]
        } else {
          var return_time = ''
        }
        row += ele.id + ',' + ele.family_name + ',' + ele.name + ',' + ele.weblogin + ',' + ele.status + ',' + leave_time + ',' + return_time + '\n'
      })
      var csvFile = header + row
      this.downloadCSV(csvFile)
    },
    downloadCSV (csv) {
      var hiddenElement = document.createElement('a')
      hiddenElement.href = 'data:attachment/csv,' + encodeURI(csv)
      hiddenElement.target = '_blank'
      hiddenElement.download = this.date.start.date.toISOString().split('T')[0] + '_' + this.date.end.date.toISOString().split('T')[0] + '.csv'
      hiddenElement.click()
    }
  },
  beforeCreate () {
    if (!localStorage.getItem('weblogin') || localStorage.getItem('weblogin') == undefined) {
      window.location.href = 'https://eps.rchk.edu.hk';
    }
  },
  watch: {
    'date.start.date': function (newVal) {
      if (newVal > this.date.end.date) {
        this.date.start.err = true
      } else {
        this.date.start.err = false
      }
    },
    'date.end.date': function (newVal) {
      if (newVal < this.date.start.date) {
        this.date.end.err = true
      } else {
        this.date.end.err = false
      }
    },
    'showCSV': function (newVal) {
      if (!newVal) {
        this.date.start.date = new Date()
        this.date.end.date = new Date()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
$background: #00212B;
$sec-color: #00e2ff;

.logs{
  height: 100%;
  width: 100%;
}
.action-btn{
  height: 46px;
  margin: auto;
  outline: none;
  border: 0px;
  border-radius: 5px;
  background-color: #00212B;
  color: $sec-color;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
  label{
    margin: 0 10px 0px 0px;
    font-weight: 700;
    font-size: 16px;
    height: 24px;
    padding-top: 2px;
    cursor: pointer;
  }
  .btn-icon{
    margin: 0 5px;
    font-size: 14px !important;
    cursor: pointer;
  }
}
.card{
  width: 100%;
  background-color: #fff;
  &.title-card{
    height: 68px;
    padding: 0 20px;
    .title-card-content{
      display: flex;
      .title{
        margin: 10px;
        color: $background;
        text-align: left;
        width: fit-content;
      }
      .btn-group{
        width: fit-content;
        margin-left: auto;
      }
    }
  }
  &.csv-card{
    height: 68px;
    margin-top: 20px;
    .csv-card-content{
      display: flex;
      padding: 10px 20px;
      height: 100%;
      .date-icon{
        height: 46px;
        &.fail{
          color: red;
        }
      }
      .btn-group{
        margin-left: auto;
      }
      .date-picker-wrapper /deep/ .date-input{
        height: 46px;
        border: 0;
        border-bottom: 1px solid;
        margin-left: 10px;
        padding-left: 10px;
      }
      .date-picker-wrapper{
        display: flex;
        width: 170px;
        margin: auto;
        i{
          margin: 0;
        }
        p{
          margin: auto;
          margin-right: 20px;
          &.fail{
            color: red;
          }
        }
      }
    }
  }
  &.table-card{
    height: calc(100% - 88px);
    margin-top: 20px;
    display: inline-block;
    overflow: auto;
    .sub-table-card{
      height: 100%;
      width: calc(50% - 10px);
    }
    &.collapse{
      height: calc(100% - 176px);
    }
  }
}

.show-csv-card-enter{
  transform: translateY(-60px);
  opacity: 0;
}

.show-csv-card-enter-active{
  transition: all .5s;
}
</style>
