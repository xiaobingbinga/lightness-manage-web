import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../http'

Vue.use(Vuex)

const findChildRoutes = function (menus,routes = []) {
    menus.forEach(item => {
        if (item.href && item.href.trim().length){
            routes.push({
                path:item.href.trim(),
                component:()=>import(`@/views/${item.raw.component}`)
            })
        }
        if (item.children && Array.isArray(item.children) && item.children.length){
            findChildRoutes(item.children,routes)
        }
    })
    return routes
}

// 定义一个数据共享的state
const state = {
    // 保存token
    token:'',
    // 保存一个标识信息，指示登陆后需要加载的初始化数据是否完成
    loaded:false,
    // 保存用户信息
    user:null,
    // 保存菜单信息
    menus:[],
    // 保存动态路由的信息
    dynamicRoutes:[]
}

// 定义一个store的计算属性 - 一般用于查询显示
const getters = {
    // 获取token
    getToken: state => {
        return state.token || window.localStorage.getItem('token')
    },
    // 获取用户
    getUser: state => state.user,
    // 获取动态路由的数据
    getDynamicRoutes: state => state.dynamicRoutes,
    isLoaded: state => state.loaded
}

// 更改数据 - 同步操作
const mutations = {
    setToken:(state,token) => {
        state.token = token
        // 同时设置token在local中
        window.localStorage.setItem('token',token)
    },
    removeToken: (state) => {
        state.token = ''
        window.localStorage.removeItem('token')
    },
    // 设置是否加载完成
    setLoaded:(state,loaded) => {
        state.loaded = loaded
    },
    setUser:(state,user) => {
        state.user = user
    },
    setMenus:(state,menus) => {
        state.menus = menus
    },
    setDynamicRoutes:(state,dynamicRoutes) => {
        state.dynamicRoutes = dynamicRoutes
    }
}

// 更改数据 - 同步异步都可以
const actions = {
    loadUser: async ({commit,getters}) => {
        // 根据token获取用户的信息
        let {data:user} = await axios.get(`/users/token/${getters.getToken}`)
        // 设置用户
        commit('setUser',user)
    },
    loadMenus:async ({commit,state}) => {
        // 发送Ajax获取菜单数据
        let result = await axios.get(`/users/${state.user.id}/menus`)
        // 保存菜单信息
        commit('setMenus',result.data)
    },
    loadDynamicRoutes:async ({commit,state}) => {
        let menus = state.menus
        let dynamicRoutes = [{
            path:'/',
            redirect:'/dashboard',
            component:() => import('../container/Container'),
            children:findChildRoutes(menus)
        }]
        // 设置路由
        commit('setDynamicRoutes',dynamicRoutes)

    },
    // 清除加载的相关数据
    clearData:({commit}) => {
        commit('removeToken')
        commit('setUser',null)
        commit('setMenus',[])
        commit('setDynamicRoutes',[])
        commit('setLoaded',false)
    }
}

const store = new Vuex.Store({
    // 这是所有共享数据的保存的地方
    state,
    // 这里是计算属性
    getters,
    // 这里定义的是更改数据的方法(同步 - 不能使用 Ajax 异步操作)
    mutations,
    actions,
    modules: {}
})

export default store
