<template>
<div class="log-table-wrapper">
  <div class="log-table log-table-top">
    <md-table v-model="logData['exit']['arr']" md-sort="" class="md-elevation-5 log-table-card" md-card md-fixed-header @md-selected="exitSelected">

      <md-table-toolbar>
        <md-list>
          <md-list-item>
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">Count: {{logData['exit']['count']}}</span>
          </md-list-item>
        </md-list>
        <h1 class="md-title">Exit/Return Log</h1>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="Empty Log"
        :md-description="`No user found or empty log. You can press the load button to see if there are any previous logs.`">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
        <md-table-cell md-label="User_id" md-sort-by="user_id" md-numeric>{{ item.weblogin }}</md-table-cell>
        <md-table-cell md-label="Year" md-sort-by="year">{{ item.school_year }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Family_name" md-sort-by="family_name">{{ item.family_name }}</md-table-cell>
        <md-table-cell md-label="First_name" md-sort-by="first_name">{{ item.first_name }}</md-table-cell>
        <md-table-cell md-label="House" md-sort-by="house">{{ item.house }}</md-table-cell>
      </md-table-row>

    </md-table>
  </div>
  <div class="log-table log-table-bottom">
    <md-table v-model="logData['leave']['arr']" md-sort="" class="md-elevation-5 log-table-card" md-card md-fixed-header @md-selected="leaveLogSelected">
        <md-table-toolbar>
            <md-list>
                <md-list-item>
                    <md-icon>account_circle</md-icon>
                    <span class="md-list-item-text">Count: {{logData['leave']['count']}}</span>
                </md-list-item>
            </md-list>
            <h1 class="md-title">Leave Log</h1>
        </md-table-toolbar>

        <md-table-empty-state
            md-label="Empty Log"
            :md-description="`No user found or empty log. You can press the load button to see if there are any previous logs.`">
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single">
            <md-table-cell md-label="User_id" md-sort-by="user_id" md-numeric>{{ item.weblogin }}</md-table-cell>
            <md-table-cell md-label="Year" md-sort-by="year">{{ item.school_year }}</md-table-cell>
            <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
            <md-table-cell md-label="Family_name" md-sort-by="family_name">{{ item.family_name }}</md-table-cell>
            <md-table-cell md-label="First_name" md-sort-by="first_name">{{ item.first_name }}</md-table-cell>
            <md-table-cell md-label="House" md-sort-by="house">{{ item.house }}</md-table-cell>
        </md-table-row>
    </md-table>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      logData: {
        'exit': {
          'arr': [], 'count': 0
        },
        'leave': {
          'arr': [], 'count': 0
        }
      },
      count: 0
    }
  },
  methods: {
    getClass: ({ id }) => ({
      'md-primary': id === 2,
      'md-accent': id === 3
    }),
    showLogs (status) {
      this.$http.get('/api/exitpass/get-exit-log/' + status)
        .then(response => {
          this.logData[status]['arr'] = response.data.Request
          this.logData[status]['count'] = this.logData[status]['arr'].length
        })
        .catch(error => {
          alert('log error' + error)
        })
    },
    exitSelected (item) {
      this.$emit('clicked', {
        'type': 'exit',
        'item': item
      })
    },
    leaveLogSelected (item) {
      this.$emit('clicked', {
        'type': 'leave',
        'item': item
      })
    }
  },
  created () {
    this.showLogs('exit')
    this.showLogs('leave')
  }
}
</script>
<style lang="scss" scoped>
.md-toolbar{
    background-color: #F9AA33;
    color: #232F34;
}
.md-table{
  text-align: left;
}

.log-table-card{
  height: 100%;
}

.md-table-head{
  color: #F9AA33;
}
</style>
