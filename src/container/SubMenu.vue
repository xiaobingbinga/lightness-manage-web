<template>
  <el-submenu :index="item.href && item.href.trim() || item.id + ''">
    <template slot="title">
      <i class="fa-fw" :class="[item.icon]"></i>
      <span>{{item.text}}</span>
    </template>
    <!--循环菜单项下面的子菜单-->
    <template v-for="(subItem,index) in item.children">
      <!--单个菜单项-->
      <el-menu-item :key="index" :index="subItem.href" v-if="!subItem.children">
        <i class="fa-fw" :class="[subItem.icon]"></i>
        <span slot="title">{{subItem.text}}</span>
      </el-menu-item>
      <!--包含子菜单的菜单项-->
      <sub-menu :key="index" :item="subItem" v-else></sub-menu>
    </template>

  </el-submenu>
</template>

<script>
  export default {
    name: "SubMenu",
    props:{
      item:{
        type:Object
      }
    }

  }
</script>

<style scoped>

</style>