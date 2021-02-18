import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store"

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
router.beforeEach(async (to, form, next) => {

    if (to.name === 'Login') {
        next()
    } else {
        // 得到store对象
        let $store = router.app.$store || store
        // 校验token是否存在
        if ($store.getters.getToken) {
            // 判断是否加载完毕数据
            if (!$store.getters.isLoaded){
                // 加载用户信息
                if (!$store.getters.getUser){
                    await $store.dispatch('loadUser')
                }
                // 加载菜单
                await $store.dispatch('loadMenus')
                // 加载动态路由数据
                await $store.dispatch('loadDynamicRoutes')
                // 加载动态路由数据到router
                router.addRoutes($store.getters.getDynamicRoutes)
                // 设置加载完毕
                $store.commit('setLoaded',true)
                // 重新替换地址
                // await router.replace(to.path)
                // next(to)
                await router.push(to)
            }else {
                next()
            }
        } else {
            next({name: 'Login'})
        }
    }
})
export default router
