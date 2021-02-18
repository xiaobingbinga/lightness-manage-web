let menus = [
    {
        text: "首页",
        icon: "fa fa-home",
        href: "/dashboard",
    },{
        id: 2,
        text: '商品管理',
        icon: 'fa fa-list',
        children: [{
            text: '商品分类',
            icon: 'fa fa-globe',
            href: '/goods/category'
        }, {
            text: '商品品牌',
            icon: 'fa fa-diamond',
            href: '/goods/brand'
        }, {
            text: '商品规格',
            icon: 'fa fa-tags',
            href: '/goods/specification'
        },{
            text: '商品列表',
            icon: 'fa fa-list-ul',
            href: '/goods'
        }]
    }, {
        id: 3,
        text: '销售管理',
        icon: 'fa fa-sellsy',
        children: [{
            text: '销售上柜',
            icon: 'fa fa-gavel',
            href: '/sales/shoppe'
        }, {
            text: '销售出库',
            icon: 'fa  fa-paper-plane',
            href: '/sales/delivery'
        }, {
            text: '销售退货',
            icon: 'fa fa-level-down',
            href: '/sales/return'
        }]
    }, {
        id: 4,
        text: '仓库管理',
        icon: 'fa fa-database',
        children: [{
            text: '商品入库',
            icon: 'fa fa-sign-in',
            href: '/stock/entry'
        }, {
            text: '商品出库',
            icon: 'fa fa-sign-out',
            href: '/stock/out'
        }]
    }, {
        id: 5,
        text: '报表查询',
        icon: 'fa fa-area-chart',
        children: [{
            text: '销售报表',
            icon: 'fa fa-line-chart',
            href: '/report/sales'
        }, {
            text: '购进报表',
            icon: 'fa fa-bar-chart',
            href: '/report/purchase'
        }, {
            text: '库存统计',
            icon: 'fa fa-pie-chart',
            href: '/report/inventory'
        }]
    }, {
        id: 1,
        text: '系统设置',
        icon: 'fa fa-cog',
        children: [{
            text: '资源管理',
            icon: 'fa fa-sitemap',
            href: '/config/resource'
        }, {
            text: '部门管理',
            icon: 'fa fa-building',
            href: '/config/dept'
        }, {
            text: '职位管理',
            icon: 'fa fa-mortar-board',
            href: '/config/post'
        },  {
            text: '员工管理',
            icon: 'fa fa-users',
            href: '/config/employee'
        },{
            text: '角色管理',
            icon: 'fa fa-users',
            href: '/config/role'
        }, {
            text: '用户管理',
            icon: 'fa fa-user',
            href: '/config/user'
        }, {
            text: '日志管理',
            icon: 'fa fa-file-text',
            href: '/config/log'
        }]
    }
]

let s = [{
    group: 1,
    params:[{
        key: 1,
        value:'针扣'
    },{
        key: 2,
        value:'其它',
    },{
        key: 3,
        value : '圆形'
    },{
        key: 4,
        value:'日期显示,大三针,其它'
    },{
        key: 5,
        value: '石英'
    },{
        key: 6,
        value: '男士'
    },{
        key: '36-40mm',
        value: ['商务','休闲风','时尚','复古']
    },{
        key: 9,
        value: '30米'
    },{
        key: 11,
        value: '玫瑰金'
    }]
}]
console.log(s)
export default menus;