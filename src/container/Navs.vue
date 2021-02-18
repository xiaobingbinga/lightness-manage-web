<template>
    <el-menu :default-active="defaultNav" :router="true" :collapse="navCollapse">
        <template v-for="item in menus">
            <!--单个菜单项-->
            <el-menu-item :key="item.id" :index="item.href" v-if="!item.children">
                <i class="fa-fw" :class="[item.icon]"></i>
                <span slot="title">{{item.text}}</span>
            </el-menu-item>
            <!--包含子菜单的菜单项-->
            <sub-menu :key="item.id" :item="item" v-else></sub-menu>
        </template>
    </el-menu>
</template>

<script>
    // import menus from '../menus'
    import SubMenu from './SubMenu'
    import {mapState} from 'vuex'
    export default {
        name: "Navs",
        components:{
            SubMenu
        },
        props:{
            navCollapse:{
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            // menus:[],
            defaultNav:'/'
        }),
        computed:{
            ...mapState([
                'menus'
            ])
        },
        mounted() {
            this.defaultNav = this.$route.path;
        }
    }
</script>

<style scoped>
    .el-menu /deep/ .fa-fw {
        margin-right: 5px;
        width: 24px;
        text-align: center;
        font-size: 18px;
    }
</style>