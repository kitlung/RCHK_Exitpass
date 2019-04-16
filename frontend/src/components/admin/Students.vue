<template>
    <div class='student'>
        <div class="card title-card">
          <div class="title-card-content">
            <h1 class="title">Students</h1>
            <div class="btn-group">
              <button class="action-btn" @click="importMissingStudents"><md-icon class="btn-icon">person_add</md-icon><label>Import Missing Students</label></button>
            </div>
          </div>
        </div>
        <div class="card table-card">
          <vue-good-table 
            class="table" 
            ref="table"
            :columns="columns" 
            :rows="studentsData" 
            :fixed-header="true" 
            @on-cell-click="clickedOnCell"
            :pagination-options="{
              enabled: true,
              mode: 'records',
              perPage: 10,
              position: 'top',
              dropdownAllowAll: true,
              perPageDropdown: [10,20],
              setCurrentPage: 1,
              nextLabel: 'next',
              prevLabel: 'prev',
              ofLabel: 'of',
              pageLabel: 'page', // for 'pages' mode
              allLabel: 'All'
            }" 
            :select-options="{
              enabled: true,
              selectionInfoClass: 'selected-action-bar',
              selectOnCheckboxOnly: true
            }"
            styleClass="vgt-table bordered"
          >
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'permission'">
                <span v-bind:class="props.row.permission == 'Allow' ? 'allow' : 'denied'" class="sign can-click">{{props.row.permission}}</span> 
              </span>
              <span v-else-if="props.column.field == 'house'">
                <span v-bind:class="props.row.house" class="sign">{{props.row.house}}</span> 
              </span>
              <span v-else-if="props.column.field == 'logs'">
                <font-awesome-icon icon="file-alt" class="can-click"/>
              </span>
              <span v-else>
                {{props.formattedRow[props.column.field]}}
              </span>
            </template>

            <div slot="selected-row-actions">
              <button @click="batchTogglePermission">Toggle Permission</button>
            </div>
          </vue-good-table>
        </div>
      <notifications group="error" classes="vue-notification error"/>
      <notifications group="success" classes="vue-notification success"/>
      <modal ref="modal" v-on:refreshStudentsTable="getStudents"></modal>
    </div>
</template>

<script>
import Modal from './Modal'
export default {
  name: 'Students',
  components: {
    Modal
  },
  data () {
    return {
      columns: [
        {
          label: 'Name',
          field: 'name',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'College ID',
          field: 'weblogin',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Year',
          field: 'school_year',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: ['Y12', 'Y13'],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Roll Group',
          field: 'advisory',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'House',
          field: 'house',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: ['TANG', 'MING', 'QING', 'SONG'],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Permission',
          field: 'permission',
          sortable: true,
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: ['Allow', 'Deny'],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Change History',
          field: 'logs',
        }
      ],
      lateCount: false,
      recordsSelected: '',
      studentsData: ''
    }
  },
  methods: {
    importMissingStudents () {
      this.$http.post('/api/exitpass/import-student')
        .then(response => {
          if (response.data.Error === true) {
            this.$notify({
              group: 'error',
              title: 'Error',
              text: 'Error: ' + response.data.Message
            })
          } else {
            this.$notify({
              group: 'success',
              title: 'Success',
              text: response.data.Message
            })
            this.getStudents()
          }
        })
    },
    getStudents () {
      this.$http.get('/api/exitpass/get-students')
        .then(response => {
          this.studentsData = response.data.Request
          this.studentsData.forEach((student) => {
            student.permission = student.permission === 1 ? 'Allow' : 'Deny'
          })
        })
        .catch(error => {
          this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Error: ' + error + ' Could not get students.'
          })
        })
    },
    clickedOnCell (params) {
      switch (params.column.field) {
        case 'permission':
          this.togglePermission(params)
          break
        case 'logs':
          this.checkLog(params)
          break
      }
    },
    checkLog (params) {
      this.$refs['modal'].show('logs', params)
    },
    batchTogglePermission () {
      var selected = this.$refs['table'].selectedRows
      this.$refs['modal'].show('batchPermission', selected)
    },
    togglePermission (params) {
      this.$refs['modal'].show('permission', params)
    },
  },
  created () {
    this.getStudents()
  }
}
</script>

<style lang="scss" scoped>
$background: #00212B;
$success: #4caf50;
$fail: #ff1253;
$ming: #3f5fac;
$tang: #d33419;
$qing: #56ac40;
$song: #ebe738;
$sec-color: #00e2ff;


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
  &.table-card{
    height: calc(100% - 88px);
    margin-top: 20px;
  }
}


.student {
  color: black;
  overflow: auto;
  height: 100%;
  width: 100%;
  .table {
    width: 100%;
    height: 100%;
    overflow: auto;
    .sign{
      padding: 5px;
      border-radius: 5px;
      color: #fff;
      &.allow{
        background-color: $success;
      }
      &.denied{
        background-color: $fail;
      }
      &.MING{
        background-color: $ming;
      }
      &.QING{
        background-color: $qing;
      }
      &.SONG{
        background-color: $song;
        color: #000;
      }
      &.TANG{
        background-color: $tang;
      }
    }
    .can-click{
        cursor: pointer;
    }
  }
}


.md-dialog-title {
  background-color: rgb(230, 180, 75);
  margin-bottom: 8px;
  padding-bottom: 10px;
  box-shadow: 0 0 20px 5px rgba(55, 55, 55, 0.5);
}

.updateTable {
  width: 80%;
  margin-right: auto;
  margin-left: auto;
  display: block;
  margin-bottom: 70px;
  height: 70%;
}

tr {
  height: 30px;
}

.md-dialog-title {
  align-self: center;
}

.md-title{
    align-self: center;
    padding-right: 130px;
}

.inputSearch {
    width: 50px;
    right: 90px;
}
.studentCountIcon {
  color: black;
}

.text{
  color: black;
}

.md-badge {
    font-size: 16px;
    color: #000000;
    left: 5px;
}

.md-table-row {
    white-space: nowrap;
}

.md-table-cell{
    white-space: nowrap;
    padding-left: 0%;
    padding-right: 0%;
    width: 90px;
}

.md-dialog {
    background-color: #ffffff;
}

</style>
