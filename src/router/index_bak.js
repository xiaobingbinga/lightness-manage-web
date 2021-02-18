import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由地址和组件映射
const routes = [
    {
        path: '/test',
        name: 'Test',
        component: () => import('../views/Test')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login')
    }
]

// 创建一个路由器对象
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 添加一个路由的全局前置守卫
router.beforeEach((to, form, next) => {
    // to：表示需要跳转的地址
    // from：表示从哪个地址产生的跳转
    // next：回调的钩子函数，用来实现异步操作的确认
    // console.log(to)

    // 除了登录页面，其余的页面跳转都需要校验
    if (to.name === 'Login') {
        next()
    } else {
        console.log(this)
        // 需要校验是否登录
        // if (window.sessionStorage.getItem('login_ticket')){
        if (window.localStorage.getItem('login_ticket')) {
            console.log('放行 -------> ' + to.fullPath)
            console.log(to)
            next()
        } else {
            next({name: 'Login'})
        }
    }
})
export default router
