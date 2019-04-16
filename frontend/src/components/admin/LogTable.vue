<template>
  <div>
    <vue-good-table 
      class="table" 
      ref="table"
      :columns="columns" 
      :rows="tableData" 
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
        selectOnCheckboxOnly: true
      }"
      styleClass="vgt-table bordered"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field === 'house'">
          <span v-bind:class="props.row.house" class="sign">{{props.row.house}}</span> 
        </span>
        <span v-else-if="props.column.field === 'status'">
          <span v-bind:class="props.row.status" class="status">{{props.row.status}}</span> 
        </span>
        <span v-else>
          {{props.formattedRow[props.column.field]}}
        </span>
      </template>
    </vue-good-table>
    <notifications group="error" classes="vue-notification error"/>
    <notifications group="success" classes="vue-notification success"/>
  </div>
</template>
<script>
export default {
  name: 'LogRecord',
  data () {
    return {
      tableData: [],
      columns: [
        {
          label: 'Name',
          field: 'name',
          filterOptions: {
            enabled: true, // enable filter for this column
            placeholder: 'All', // placeholder for filter input
            filterDropdownItems: [], // dropdown (with selected values) instead of text input
            filterFn: this.columnFilterFn // custom filter function that
          }
        },
        {
          label: 'College ID',
          field: 'weblogin',
          filterOptions: {
            enabled: true, // enable filter for this column
            placeholder: 'All', // placeholder for filter input
            filterDropdownItems: [], // dropdown (with selected values) instead of text input
            filterFn: this.columnFilterFn // custom filter function that
          }
        },
        {
          label: 'Year',
          field: 'school_year',
          filterOptions: {
            enabled: true, // enable filter for this column
            placeholder: 'All', // placeholder for filter input
            filterDropdownItems: ['Y12', 'Y13'], // dropdown (with selected values) instead of text input
            filterFn: this.columnFilterFn // custom filter function that
          }
        },
        {
          label: 'House',
          field: 'house',
          filterOptions: {
            enabled: true, // enable filter for this column
            placeholder: 'All', // placeholder for filter input
            filterDropdownItems: ['TANG', 'MING', 'QING', 'SONG'], // dropdown (with selected values) instead of text input
            filterFn: this.columnFilterFn // custom filter function that
          }
        },
        {
          label: 'Exit Time',
          field: 'leave_time',
          filterOptions: {
            enabled: true,
            placeholder: 'All',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Return Time',
          field: 'return_time',
          filterOptions: {
            enabled: true,
            placeholder: 'All',
            filterDropdownItems: [],
            filterFn: this.columnFilterFn
          }
        },
        {
          label: 'Status',
          field: 'status',
          filterOptions: {
            enabled: true,
            placeholder: 'All',
            filterDropdownItems: ['exit', 'returned', 'leave'],
            filterFn: this.columnFilterFn
          }
        }]
    }
  },
  methods: {
    getLogs () {
      this.$http.get('/api/exitpass/get-exit-log/')
        .then(response => {
          this.tableData = response.data.Request
          this.tableData.forEach(data => {
            if (data.status === 'returned') {
              data.return_time = data.return_time.split('T')[0] + ' ' + data.return_time.split('T')[1].split('.')[0]
            }
            data.leave_time = data.leave_time.split('T')[0] + ' ' + data.leave_time.split('T')[1].split('.')[0]
          })
          this.$notify({
            group: 'success',
            title: 'Success',
            text: 'Current log refreshed.'
          })
        })
        .catch(error => {
          this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Error: ' + error + 'Cannot get late logs.'
          })
        })
    },
  },
  created () {
    this.getLogs()
  }
}
</script>
<style lang="scss" scoped>
$ming: #3f5fac;
$tang: #d33419;
$qing: #56ac40;
$song: #ebe738;

$returned: #4caf50;
$leave: #ff1253;
$exit: #ff9800;
.table{
  .sign{
    padding: 5px;
    border-radius: 5px;
    color: #fff;
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
  .status{
    padding: 5px;
    border-radius: 5px;
    color: #fff;
    &.returned{
      background-color: $returned;
    }
    &.leave{
      background-color: $leave;
    }
    &.exit{
      background-color: $exit;
    }
  }
  .action-btn{
    cursor: pointer;
  }
}
</style>
