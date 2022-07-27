import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index_old'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // {
  //   path: '/checkhome',
  //   component: () => import('@/views/demo/index'),
  //   hidden: true
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  /**
   * 注意: 子菜单只在路由子菜单时出现。长度> = 1
   * 参考网址: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
   *
   * hidden: true                   如果设置为true，项目将不会显示在侧栏中(默认为false)
   * alwaysShow: true               如果设置为true，将始终显示根菜单
   *                                如果不设置alwaysShow, 当项目有多个子路由时，它将成为嵌套模式，否则不显示根菜单
   * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
   * name:'router-name'             the name is used by <keep-alive> (must set!!!)
   * meta : {
      roles: ['admin','editor']    控制页面角色(可以设置多个角色)
      title: 'title'               名称显示在侧边栏和面包屑(推荐集)
      icon: 'svg-name'             图标显示在侧栏中
      breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中(默认为true)
      activeMenu: '/example/list'  如果设置路径，侧栏将突出显示您设置的路径
      noCache: true  当设置为true时，<keep-alive>(默认为false)将不会缓存路由。

      breadcrumb: false //如果为false，则该项将隐藏在breadcrumb中(默认为true)

    }
   */
  {
    path: '/initiateflow',
    alwaysShow: false,
    component: Layout,
    children: [
      {
        path: '/initiateflow/index',
        name: 'initiateflow',
        meta: { title: '发起流程', icon: '发起流程', noCache: false },
        component: () => import('@/views/initiateflow/index')
      }
    ]
  },
  {
    path: '/backlog',
    alwaysShow: false,
    component: Layout,
    children: [
      {
        path: '/backlog/index',
        name: 'backlog',
        meta: { title: '待办业务', icon: '待办业务', noCache: false },
        component: () => import('@/views/backlog/index')
      }
    ]
  },
  {
    path: '/myflow',
    alwaysShow: false,
    component: Layout,
    children: [
      {
        path: '/myflow/index',
        name: 'myflow',
        meta: { title: '我的业务', icon: '我的业务', noCache: false },
        component: () => import('@/views/queryFlow/myFlow')
      }
    ]
  },

  {
    path: '/demo',
    name: 'demo测试',
    alwaysShow: false,
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/supplier/index',
        name: 'project_supplier',
        meta: { title: 'demo测试', icon: '供应商', noCache: true },
        component: () => import('@/views/supplier/index')
      }
    ]
  },

  {
    path: '/SystemSettings',
    component: Layout,
    redirect: 'noRedirect',
    name: 'SystemSettings',
    // hidden: true,
    meta: {
      title: '系统设置',
      icon: '系统设置',
      roles: ['系统管理员']
    },
    children: [

      {
        path: 'flow_node/index',
        component: () => import('@/views/flow_node/index'),
        name: 'flowdesign',
        meta: { title: '流程设计', noCache: true, icon: '流程设计' }
      },
      {
        path: 'flow_config/index',
        component: () => import('@/views/flow_config/index'),
        name: 'flowconfig',
        meta: { title: '流程配置', noCache: true, icon: '流程配置' }
      },
      {
        path: 'sysuser',
        component: () => import('@/views/SystemSettings/Users/index'),
        name: 'sysuser',
        meta: { title: '系统用户', noCache: true, icon: '系统用户' }
      },
      {
        path: 'sysrole',
        component: () => import('@/views/SystemSettings/role/index'),
        name: 'sysrole',
        meta: { title: '系统角色', noCache: true, icon: '系统角色' }
      },
      {
        path: 'SystemSettingsDepartment',
        component: () => import('@/views/SystemSettings/Department/index'),
        name: 'SystemSettingsDepartment',
        meta: { title: '公司部门', noCache: true, icon: '部门设置' }
      }
    ]
  },
  // 待办业务 查看/处理

  {
    hidden: true,
    path: '/lookinfo',
    name: 'lookinfo',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/backlog/components/look',
        hidden: 'true',
        component: () => import('@/views/backlog/components/look'),
        name: 'look',
        meta: { title: '查看/处理', noCache: true }
      },
      // 流程监控
      {
        path: '/flowMonitor/index',
        hidden: 'true',
        component: () => import('@/bitcomponents/flowMonitor/newindex'),
        name: 'flowMonitor',
        meta: { title: '流程监控', noCache: true }
      }
    ]
  },

  // 我的流程 详情

  {
    hidden: true,
    path: '/queryFlow',
    name: 'queryFlow',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/queryFlow/details/index',
        hidden: 'true',
        component: () => import('@/views/queryFlow/components/details'),
        name: 'details',
        meta: { title: '查看详情', noCache: true }
      }
    ]
  },

  // 发起流程跳转
  {
    hidden: true,
    path: '/flowinit',
    name: 'flowinit',
    alwaysShow: true,
    component: Layout,
    redirect: 'noRedirect',
    children: [
      {
        path: '/flowinit/index',
        hidden: 'true',
        component: () => import('@/views/supplier/components/newaddsupplier'),
        name: 'addsupplier',
        meta: { title: '发起流程', noCache: true }
      },
      // 编制汇总
      {
        path: '/flowinit/index',
        hidden: 'true',
        component: () => import('@/views/budgethandle/budgetInit/index.vue'),
        name: 'budgetInit',
        meta: { title: '编制发起', noCache: true }
      },

      // 测试
      {
        path: '/path_Test',
        hidden: 'true',
        component: () =>
          import('@/views/path_Test/index.vue'),
        name: 'path_Test',
        meta: {
          title: '测试',
          noCache: true
        }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
