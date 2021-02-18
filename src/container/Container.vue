<template>
    <el-container class="h-100">
        <!--侧边栏设置-->
        <el-aside style="width: auto">
            <Navs :style="{width:navWidth}" class="h-100" :nav-collapse="navCollapse"></Navs>
        </el-aside>
        <el-container>
            <!--系统头部工具条-->
            <el-header class="bg-primary d-flex align-items-center" style="background-color: #66B1FF;">
                <el-button class="btn-plain" @click.stop="toggleNav">
                    <i class="fa fa-list"></i>
                </el-button>
                <h3 class="title">{{title}}</h3>
                <el-dropdown trigger="click" @command="handleCommand">
                    <el-button class="btn-plain" type="text">
                        <el-avatar :size="50" :src="avatarUrl"></el-avatar>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" split-button>
                        <el-dropdown-item class="bg-primary" disabled>{{user && user.account}} 你好!!!</el-dropdown-item>
                        <el-dropdown-item command="logout"><i class="fa fa-power-off"></i>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <!--主体内容-->
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import Navs from './Navs'
    import {mapState} from 'vuex'

    export default {
        name: "Container",
        components: {
            Navs
        },
        data: () => ({
            title: '轻盈ERP后台管理', // 顶部导航工具名称
            navCollapse: false, // 左侧菜单是否隐藏
            avatarUrl: 'http://localhost:8080/assets/avatar.png', // 用户头像
            username: '管理员' // 用户名称
        }),
        computed: {
            ...mapState([
                'user'
            ]),
            navWidth() {
                return this.navCollapse ? 'auto' : '250px';
            }
        },
        methods: {
            toggleNav() {
                this.navCollapse = !this.navCollapse;
            },
            handleCommand(command){
                if (command == 'logout'){
                    this.$store.dispatch('clearData')
                    this.$router.push({path:'/login'})
                }
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-dropdown-menu__item {
        width: 150px;
    }

    /deep/ .el-dropdown-menu__item.is-disabled {
        color: #FFF;
    }

    /deep/ .el-dropdown-menu.el-popper {
        margin: 0;
    }
</style>