import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 定义一个数据共享的state
const state = {
    // 登录成功后的用户信息
    user: {
        account: 'admin',
        password: '123456'
    },
    menus:[]
}

// 定义一个store的计算属性 - 一般用于查询显示
const getters = {
    account: state => state.user.account,
    // queryRoleById: function (state) {
    //     return function (id) {
    //         return state.roles.filter(function (r) {
    //             return r.id == id
    //         })
    //     }
    // }
    queryRoleById: state => id => {
        // 逻辑代码
        return state.roles.filter(r => r.id == id)
    }
}

// 更改数据 - 同步操作
const mutations = {
    // 提供一个保存用户信息的同步方法
    setUser:function(state,user){
        window.localStorage.setItem("login_ticket",JSON.stringify(user))
        state.user = user
    },
    // 提供一个保存菜单的同步方法
    setMenu:function(state,menus){
        state.menus = menus
    },

    updatePassword: function (state, arg) {
        state.user.password = arg
    }
}

// 更改数据 - 同步异步都可以
const actions = {
    // updatePass: (context,arg) => {
    //     // console.log(context)
    //     // context.commit('updatePassword',arg)
    //     // setTimeout(()=>{
    //     //     console.log('执行修改')
    //     //     context.commit('updatePassword',arg)
    //     // },2000)
    //     return new Promise((resolve)=>{
    //         setTimeout(()=>{
    //             console.log('执行修改')
    //             context.commit('updatePassword',arg)
    //             resolve()
    //         },2000)
    //     })
    // }

    updatePass({commit}, arg) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('执行修改')
                commit('updatePassword', arg)
                resolve()
            }, 2000)
        })
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
