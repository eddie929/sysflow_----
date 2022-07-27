import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import ElementUI from 'element-ui'
const state = {
  token: getToken(),
  roles: [],
  id_用户: 0,
  id_角色: 0,
  id_一级部门: 0,
  id_二级部门: 0,
  id_三级部门: 0,
  登录名: '',
  姓名: '',
  工号: '',
  职务: '',
  邮箱: '',
  手机: '',
  办公电话: '',
  角色id: '',
  角色lable: '',
  // 角色名称: '',
  一级部门编号: '',
  一级部门名称: '',
  二级部门编号: '',
  二级部门名称: '',
  三级部门编号: '',
  三级部门名称: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_id用户: (state, para) => {
    state.id_用户 = para
  },
  SET_id角色: (state, para) => {
    state.id_角色 = para
  },
  SET_id一级部门: (state, para) => {
    state.id_一级部门 = para
  },
  SET_id二级部门: (state, para) => {
    state.id_二级部门 = para
  },
  SET_id三级部门: (state, para) => {
    state.id_三级部门 = para
  },
  SET_登录名: (state, para) => {
    state.登录名 = para
  },
  SET_姓名: (state, para) => {
    state.姓名 = para
  },
  SET_工号: (state, para) => {
    state.工号 = para
  },
  SET_职务: (state, para) => {
    state.职务 = para
  },
  SET_邮箱: (state, para) => {
    state.邮箱 = para
  },
  SET_手机: (state, para) => {
    state.手机 = para
  },
  SET_办公电话: (state, para) => {
    state.办公电话 = para
  },
  SET_角色id: (state, para) => {
    state.角色id = para
  },
  SET_角色lable: (state, para) => {
    state.角色lable = para
  },
  // SET_角色名称: (state, para) => {
  //   state.角色名称 = para
  // },
  SET_一级部门编号: (state, para) => {
    state.一级部门编号 = para
  },
  SET_二级部门编号: (state, para) => {
    state.二级部门编号 = para
  },
  SET_三级部门编号: (state, para) => {
    state.三级部门编号 = para
  },
  SET_一级部门名称: (state, para) => {
    state.一级部门名称 = para
  },
  SET_二级部门名称: (state, para) => {
    state.二级部门名称 = para
  },
  SET_三级部门名称: (state, para) => {
    state.三级部门名称 = para
  }
}

const actions = {
  // user login

  login({ commit }, userInfo) {
    const { login_name, password } = userInfo

    return new Promise((resolve, reject) => {
      login({ login_name: login_name.trim(), password: password })
        .then(response => {
          if (response.code === -2) {
            ElementUI.Notification({
              title: '提示',
              message: '用户名或密码错误',
              type: 'warning',
              duration: 2 * 1000
            })

            reject()
          }

          // const { data } = response
          commit('SET_TOKEN', response.token)
          setToken(response.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response
          if (!data) {
            reject('验证失败，请重新登录')
          }
          const {
            roles,
            id_用户,
            id_角色,
            id_一级部门,
            id_二级部门,
            id_三级部门,
            登录名,
            姓名,
            工号,
            职务,
            邮箱,
            手机,
            办公电话,
            角色id,
            角色lable,
            // 角色名称,
            一级部门编号,
            一级部门名称,
            二级部门编号,
            二级部门名称,
            三级部门编号,
            三级部门名称

          } = data
          if (!roles || roles.length <= 0) {
            reject('角色不存在！')
          }
          commit('SET_ROLES', roles)
          commit('SET_id用户', id_用户)
          commit('SET_id角色', id_角色)
          commit('SET_id一级部门', id_一级部门)
          commit('SET_id二级部门', id_二级部门)
          commit('SET_id三级部门', id_三级部门)
          commit('SET_登录名', 登录名)
          commit('SET_姓名', 姓名)
          commit('SET_工号', 工号)
          commit('SET_职务', 职务)
          commit('SET_邮箱', 邮箱)
          commit('SET_手机', 手机)
          commit('SET_办公电话', 办公电话)
          commit('SET_角色id', 角色id)
          commit('SET_角色lable', 角色lable)
          // commit('SET_角色名称', 角色名称)
          commit('SET_一级部门编号', 一级部门编号)
          commit('SET_二级部门编号', 二级部门编号)
          commit('SET_三级部门编号', 三级部门编号)
          commit('SET_一级部门名称', 一级部门名称)
          commit('SET_二级部门名称', 二级部门名称)
          commit('SET_三级部门名称', 三级部门名称)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
