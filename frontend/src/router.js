import Vue from 'vue'
import Router from 'vue-router'

import Forbidden from '@/components/Forbidden'

import Student from '@/components/student/Student'

import Admin from '@/components/admin/Admin'

import Students from '@/components/admin/Students'
import CurrentLogs from '@/components/admin/CurrentLogs'
import PermissionLogs from '@/components/admin/permissionLogs'
import TempPermission from '@/components/admin/tempPermission'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/admin/students'
    },
    {
      path: '/student',
      name: 'Student',
      component: Student,
      /*

      // Code below is checking the credential key inside Kiosk Pro app

      beforeEnter: (to,from,next) => {
        let script = document.createElement('script')
        script.setAttribute('src','./static/js/kiosk_functions.js')
        document.head.appendChild(script)
    
        let injectScript = document.createElement('script')
        injectScript.text = `
                              var globalID = '';
                              window.onload = function() { 
                                kp_requestKioskId("kp_requestKioskId_callback"); 
                              };
    
                              function kp_requestKioskId_callback(kioskId) { 
                                globalID = kioskId
                              }
                            `
        document.head.appendChild(injectScript)
        setTimeout (() => {
          var payload = {device_name: window.globalID}
          Axios.post('/api/exitpass/device/auth',payload)
            .then((res) => {
              if (res.data.Error == false && res.data.Request[0].permission == 1) {
                next()
              }else{
                window.location.href = 'http://exitpass.com/#/forbidden'
              }
            })
        },1500)
      }
      */
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      children: [
        {
          path: 'students',
          components: {
            default: Students
          }
        },
        {
          path: 'currentLogs',
          components: {
            default: CurrentLogs
          }
        },
        {
          path: 'permissionLogs',
          components: {
            default: PermissionLogs
          }
        },
        {
          path: 'tempPermission',
          components: {
            default: TempPermission
          }
        }
      ]
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: Forbidden
    },
    {
      path: '*',
      redirect: '/admin/students'
    },
  ]
})
