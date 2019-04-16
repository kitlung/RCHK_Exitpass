<template>
  <div class='permission'>
    <div class="card title-card">
      <div class="title-card-content">
        <h1 class="title">Change History</h1>
      </div>
    </div>
    <div class="card table-card">
      <vue-good-table 
        class="table" 
        ref="table"
        :columns="columns" 
        :rows="studentsData" 
        :fixed-header="true" 
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
      >
        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'permission'">
            <span v-bind:class="props.row.permission == '1' ? 'allow' : 'denied'" class="sign" v-if="props.row.permission == '1'">Allow</span>
            <span v-bind:class="props.row.permission == '1' ? 'allow' : 'denied'" class="sign" v-if="props.row.permission == '0'">Deny</span>
          </span>
          <span v-else>
            {{props.formattedRow[props.column.field]}}
          </span>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'permissionLogs',
  data () {
    return {
      studentsData: [],
      columns: [
        {
          label: 'Admin Name',
          field: 'admin_name',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Student Name',
          field: 'student_name',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Reason',
          field: 'reason'
        },
        {
          label: 'Date',
          field: 'created_date',
          filterOptions: {
            enabled: true,
            placeholder: 'Filter This',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Permission',
          field: 'permission'
        }
      ]
    }
  },
  methods: {
    getStudentPermissionLogs () {
      this.$http.get('/api/exitpass/get-permission-log/all')
        .then((res) => {
          this.studentsData = res.data.Request
          this.studentsData.forEach((ele) => {
            ele.created_date = ele.created_date.split('T')[0] + ' ' + ele.created_date.split('T')[1].split('.')[0]
          })
        })
    }
  },
  created () {
    this.getStudentPermissionLogs()
  }
}
</script>
<style lang="scss" scoped>
$background: #00212B;
$sec-color: #00e2ff;
$success: #4caf50;
$fail: #ff1253;

.permission{
  height: 100%;
  width: 100%;
}

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

</style>
