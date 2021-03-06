import Axios from 'axios'
import { Message } from 'element-ui'
import qs from 'querystring'
import cookies from 'vue-cookies'

const statusKey = 'infokey'

const state = {
  username: '',
  status: cookies.get(statusKey)||100,
  loading: false,
  error: null
}
console.log(cookies.get(statusKey))
const getters = {
  isLogin (state) {
    console.log(state)
    return state.status==201
  }
}

const mutations = {
  DO_LOGIN (state) {
    state.loading = true
  },
  LOGIN (state, { username = '', status = '', error = null }) {
    state.loading = false
    state.username = username
    state.status = status
    state.error = error
  },
  LOGOUT (state) {
    state.username = ''
    state.status = ''
  }
}

const actions = {
  login ({ commit }, { username, password }) {
    commit('DO_LOGIN')
    return new Promise((resolve, reject)=>{resolve('200 OK');}).then(() => {
	  // console.log('i am promise')
    let status = 202
	  if (username == 'admin' && password == 'password') {
		  status = 201
	  }
      cookies.set(statusKey,status)
      if(status ==202){
        Message.error(`用户名或者密码错误`)
        let error = 202
				commit('LOGIN', {error})
      }else{
        commit('LOGIN', { username, status })
      }
    }).catch(error => {
      Message.error(`登录失败: ${error.message || '未知错误'}`)
      console.error(error)
      commit('LOGIN', { error })
    })
  },
  logout ({ commit }) {
    cookies.set(statusKey,100)
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
