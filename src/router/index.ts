import { createRouter, createWebHistory } from 'vue-router'
import HomeFrame from '../views/HomeFrame.vue'
import StaffView from '../views/StaffView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeFrame',
      component: HomeFrame,
      children:[
        {
          path:"staffList",
          name: "staffList",
          meta:{
            isShow: true,
            title: "Staff list"
          },
          component: () => import('../views/StaffView.vue')
        },
        {
          path:"userList",
          name: "userList",
          meta:{
            isShow:true,
            title: "User list"
          },
          component: () => import('../views/UserView.vue')
        },
        {
          path:"roleList",
          name: "roleList",
          meta:{
            isShow:true,
            title: "Role list"
          },
          component: () => import('../views/RoleView.vue')
        },
        {
          path:"authorityList",
          name: "authorityList",
          meta:{
            isShow:true,
            title: "Authority list"
          },
          component: () => import('../views/AuthorityView.vue')
        },
        {
          path:"addRoleAdminList",
          name: "addRoleAdminList",
          meta:{
            isShow:true,
            title: "AddRoleAdmin list"
          },
          component: () => import('../views/AddRoleAdmin.vue')
        }
      ]
      
      
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router;
