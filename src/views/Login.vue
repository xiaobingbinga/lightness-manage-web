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
            }
        }),
        created() {
            // console.log(this.$store.state.user);
        },
        methods: {
            handleLogin() {
                // 查找vue中的组件对象,调用表单组件的验证方法
                this.$refs.loginForm.validate(async (valid) => {
                    if (!valid) {
                        return false;
                    }

                    // 执行登录并等待响应结果
                    let result = await this.axios.post('/login',this.loginModel)
                    // 保存登录信息，保存token和user
                    this.$store.commit('setToken',result.token)
                    this.$store.commit('setUser',result.data)
                    // 加载菜单
                    await this.$store.dispatch('loadMenus')
                    // 加载动态路由数据
                    await this.$store.dispatch('loadDynamicRoutes')
                    // 加载动态路由数据到router
                    this.$router.addRoutes(this.$store.getters.getDynamicRoutes)
                    // 设置加载完毕
                    this.$store.commit('setLoaded',true)
                    // 跳转到首页
                    await this.$router.push({path: '/'})

                    // // 执行的登陆操作
                    // this.axios.post('/login',this.loginModel).then(result => {
                    //     console.log(result);
                    //     // 登录成功，保存登录的信息，同时需要保存token
                    //     this.$store.commit('setToken',result.token)
                    //     this.$store.commit('setUser',result.data)
                    //
                    //     // 加载菜单
                    //     this.axios.get(`/users/${result.data.id}/menus`).then(result => {
                    //         // 设置菜单
                    //         this.$store.commit('setMenus',result.data)
                    //         // 加载动态路由
                    //     })
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