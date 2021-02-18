let dynamicRoutes = [{
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard')
}, {
    path: '/goods/category',
    name: 'Category',
    component: () => import('./views/goods/Category')
}, {
    // 地址
    path: '/goods/brand',
    // 用于映射路径的别名
    name: 'Brand',
    // 页面需要加载的组件
    component: () => import('./views/goods/Brand')
}, {
    // 地址
    path: '/goods/specification',
    // 用于映射路径的别名
    name: 'Specification',
    // 页面需要加载的组件
    component: () => import('./views/goods/Specification')
}, {
    // 地址
    path: '/goods/list',
    // 用于映射路径的别名
    name: 'Goods',
    // 页面需要加载的组件
    component: () => import('./views/goods/Goods')
}, {
    // 地址
    path: '/config/resource',
    // 用于映射路径的别名
    name: 'Resource',
    // 页面需要加载的组件
    component: () => import('./views/config/Resource')
}, {
    // 地址
    path: '/config/role',
    // 用于映射路径的别名
    name: 'Role',
    // 页面需要加载的组件
    component: () => import('./views/config/Role')
}, {
    // 地址
    path: '/config/user',
    // 用于映射路径的别名
    name: 'User',
    // 页面需要加载的组件
    component: () => import('./views/config/User')
}]

export default dynamicRoutes