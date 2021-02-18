<template>
    <div class="fit">
        <el-card class="box-card login-box">
            <!--卡片头-->
            <div slot="header">
                <span>轻盈ERP后台管理</span>
            </div>
            <!--表单组件 ref:提供与vue中查找对象 :model：提供表单的数据对象 rules：提供用于表单验证的规则-->
            <el-form ref="loginForm" :model="loginModel" :rules="loginRules">
                <!--表单项-->
                <el-form-item prop="account">
                    <el-input v-model="loginModel.account" placeholder="账号/手机/邮箱">
                        <template slot="prepend"><i class="fa fa-user"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginModel.password" type="password" placeholder="密码">
                        <template slot="prepend"><i class="fa fa-lock"></i></template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import dynamicRoutes from "../dynamicRoutes";

    export default {
        name: "Login",
        data: () => ({
            // 登录提交的数据
            loginModel: {
                account: 'admin',
                password: 'abcdef'
            },
            // 登录验证的规则
            loginRules: {
                account: [
                    {required: true, message: '账号必填'}
                ],
                password: [
                    {required: true, message: '密码必填'}
                ]
            },
            rootRouter: {
                path: '/',
                redirect: '/dashboard',
                component: () => import('../container/Container'),
                children: [{
                    path: '/dashboard',
                    name: 'Dashboard',
                    component: () => import('../views/Dashboard')
                }]
            }
        }),
        created() {
            // console.log(this.$store.state.user);
        },
        methods: {
            matchMenu(routes, menus) {
                // for (let i = 0; i < menus.length; i ++){
                //     for (let j = 0; j < routes.length; j ++){
                //         if (menus[i].id != 1 && routes[j].path == menus[i].href){
                //             this.rootRouter.children.push(routes[j])
                //         }
                //     }
                // }


                menus.forEach(menu => {
                    routes.forEach(route => {
                        // console.log(route.path == menu.href)
                        // console.log('route.path' + route.path)
                        // console.log('menu.href' + menu.href)
                        if (menu.id != 1 && route.path == menu.href) {
                            this.rootRouter.children.push(route)
                        }
                    })
                    if (menu.children) {
                        this.matchMenu(routes, menu.children)
                    }
                })
            },

            handleLogin() {
                // 查找vue中的组件对象,调用表单组件的验证方法
                this.$refs.loginForm.validate((valid) => {
                    console.log(valid)
                    if (!valid) {
                        return false;
                    }
                    console.log(this.loginModel)
                    this.axios.post("/login", this.loginModel).then(result => {
                        console.log(result.data)
                        // 保存登录的凭证在前端界面中
                        // window.loginTicket = true
                        // window.sessionStorage.setItem('login_ticket','true')
                        // window.localStorage.setItem('login_ticket','true')

                        // 把数据保存到vuex中
                        this.$store.commit('setUser', result.data)

                        // 查询菜单
                        this.axios.get(`/users/${this.$store.state.user.id}/menus`).then(result => {
                            console.log(result)
                            this.$store.commit('setMenu', result.data)

                            console.log(dynamicRoutes);
                            console.log(result.data);

                            this.matchMenu(dynamicRoutes, result.data)

                            console.log(this.rootRouter)
                            this.$router.addRoutes([this.rootRouter]);
                            console.log(this.$router)
                            // 跳转页面
                            this.$router.push('/')
                        })
                    }).catch(res => {
                        console.log('错误');
                        console.log(res);
                    })
                    // this.axios({
                    //     url: '/login',
                    //     method: 'post',
                    //     data: this.loginModel
                    // }).then(value => {
                    //     console.log(value)
                    // })
                })
            }
        }
    }
</script>

<style scoped>
    .fit {
        /*布局*/
        display: flex;
        /*弹性盒子内容居中*/
        justify-content: center;

        width: 100%;
        height: 100%;
    }

    .login-box {
        /*垂直居中*/
        /*设置相对于父容器（flex布局）垂直居中*/
        align-self: center;
        width: 500px;
        height: 400px;
    }

    /deep/ .el-card__header {
        padding-top: 30px;
        padding-bottom: 30px;
        font-size: 30px;
        font-weight: bold;
        color: #FFFFFF;
        text-align: center;
        background-color: #409EFF;
    }

    /deep/ .el-form-item {
        margin-bottom: 30px;
    }

    /deep/ .el-form-item__error {
        margin-left: 60px;
    }
</style>