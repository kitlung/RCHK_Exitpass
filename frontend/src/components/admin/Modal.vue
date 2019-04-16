<template>
  <div>
  <transition name="modal">
    <div class="modal-mask" v-show="showLogsModal || showPermissionModal">
      <div class="modal-wrapper">
        <div class="modal-container" id="logs-modal" v-show="showLogsModal">
          <div class="modal-header">
            <slot name="header">
              <h3>Change History</h3>
              <h3 @click="close()" class="can-click">&times</h3>
            </slot>
          </div>
          <div class="modal-body">
            <vue-good-table 
              class="table" 
              ref="logsTable"
              :columns="columns" 
              :rows="studentPermissionLog" 
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

        <div class="modal-container" id="permission-modal" v-show="showPermissionModal">
          <div class="modal-header">
            <slot name="header">
              <h3>Change Permission</h3>
              <h3 @click="close()" class="can-click">&times</h3>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <h5>Reason:</h5>
              <input v-model="permissionReason">
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button pri-btn" @click="changePermission()">Confirm</button>
              <button class="modal-default-button sec-btn" @click="close()">Cancel</button>
            </slot>
          </div>
        </div>

      </div>
    </div>
  </transition>
  <notifications group="error" classes="vue-notification error"/>
  <notifications group="success" classes="vue-notification success"/>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  data () {
    return {
      showPermissionModal: false,
      showLogsModal: false,
      params: {},
      permissionReason: '',
      selected: [],
      studentPermissionLog: [],
      columns: [
        {
          label: 'Name',
          field: 'admin_name',
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
    show (flag, params) {
      switch (flag) {
        case 'permission':
          this.showPermissionModal = true
          this.params = Object.assign({},params)
          break
        case 'logs':
          this.getStudentsPermissionLog(params)
          this.showLogsModal = true
          break
        case 'batchPermission':
          this.showPermissionModal = true
          this.selected = params
          break
      }
    },
    close () {
      this.showPermissionModal = false
      this.showLogsModal = false
      this.params = {}
      this.permissionReason = ''
      this.selected = []
    },
    changePermission () {
      if (this.permissionReason != '') {
        var admin = window.localStorage.getItem('weblogin')
        if(this.selected.length == 0 && Object.keys(this.params).length > 0){ // single
          var permission = this.params.row.permission === 'Allow' ? 0 : 1
          var payload = {
            admin: admin,
            weblogin: this.params.row.weblogin,
            permission: permission,
            reason: this.permissionReason
          }
          this.$http.post('/api/exitpass/change-permission', payload)
            .then(() => {
              this.$emit('refreshStudentsTable')
              this.close()
            })
        } else if (this.selected.length > 0 && Object.keys(this.params).length == 0){ // batch
          for (var index in this.selected) {
            var permission = this.selected[index].permission === 'Allow' ? 0 : 1
            var payload = {
              admin: admin,
              weblogin: this.selected[index].weblogin,
              permission: permission,
              reason: this.permissionReason
            }
            this.$http.post('/api/exitpass/change-permission', payload)
            if (parseInt(index) === this.selected.length - 1) {
              this.$emit('refreshStudentsTable')
              this.close()
            }
          }
        }
      } else {
        this.$notify({
          group: 'error',
          title: 'Error',
          text: 'Error: Reason cannot be empty.'
        })
      }
    },
    getStudentsPermissionLog (params) {
      this.$http.get('/api/exitpass/get-permission-log/'+params.row.weblogin)
        .then((res) => {
          this.studentPermissionLog = res.data.Request
          this.studentPermissionLog.forEach((ele) => {
            ele.created_date = ele.created_date.split('T')[0] + ' ' + ele.created_date.split('T')[1].split('.')[0]
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
$background: #00212B;
$sec-color: #00e2ff;
$success: #4caf50;
$fail: #ff1253;

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-header{
  background-color: $background;
  color: $sec-color;
  border-radius: 0;
  h3{
    margin: 0;
  }
  .can-click{
    cursor: pointer;
  }
}

.modal-footer{
  padding: 0px 10px;
  border-top: 0;
  padding-bottom: 10px;
}


.modal-default-button{
  height: 46px;
  margin: auto;
  outline: none;
  border: 0px;
  border-radius: 5px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
  font-weight: 700;
  padding: 0 20px;
  &.pri-btn{
    background-color: $background;
    color: $sec-color;
  }
  &.sec-btn{
    background-color: transparent;
    color: $background;
    border: 1px solid $background;
  }
}


#permission-modal {
  &.modal-container {
    width: 700px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }
  .modal-body{
    h5{
      float: left;
      color: $background;
    }
    input{
      width: 100%;
      border: 0px;
      border-bottom: 1px solid $background;
      height: 50px;
      font-size: 18px;
      &:focus{
        outline: none;
      }
    }
  }
}

#logs-modal {
  &.modal-container {
    width: 700px;
    margin: 0px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    .modal-body{
      height: 660px;
      overflow: auto;
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
    .modal-body{
      overflow: auto;
    }
  }
}


.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
