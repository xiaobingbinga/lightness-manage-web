<template>
    <div style="display: flex;flex-direction: column;height: 100%">
        <!--面包屑导航-->
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品规格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!--规格参数-->
        <div style="display: flex;flex: 1">
            <el-card style="width: 300px; margin-right: 20px">
                <div slot="header">选择分类查看规格参数</div>

                <el-tree :data="categories" :props="treeProps" empty-text="emptyText" @node-click="selectCategory">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <i :class="{'el-icon-folder':!data.raw.isLeaf,'el-icon-document':data.raw.isLeaf}"></i>
                        <span class="custom-tree-text">{{data.text}}</span>
                    </span>
                </el-tree>
            </el-card>
            <el-card style="flex: 1">
                <div slot="header">规格参数模板【{{selectedCategory ? selectedCategory.text : '请选择分类'}}】</div>
                <!--每个分组都是一个卡片-->
                <el-card v-for="group in specificationGroups" :key="group.id">
                    <div slot="header">{{group.name ? group.name : '基础信息'}}</div>
                    <el-collapse>
                        <el-collapse-item v-for="param in group.params" :key="param.id">
                            <div slot="title">{{param.name}}</div>
                            <el-form>
                                <el-form-item label="是否是数组">
                                    <el-switch v-model="param.numeric"></el-switch>
                                </el-form-item>
                                <el-form-item label="通用属性">
                                    <el-switch v-model="param.generic"></el-switch>
                                </el-form-item>
                                <el-form-item label="可搜索">
                                    <el-switch v-model="param.generic"></el-switch>
                                </el-form-item>
                                <el-form-item label="搜索分段值">
                                    <el-input v-model="param.generic"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Specification",
        data:()=>({
            categories:[],
            treeProps: {
                children: 'children',
                label: 'text'
            },
            emptyText:'暂无商品分类数据',
            selectedCategory:null,
            specificationGroups:[{
                id:1,
                categoryId:5,
                name:'',
                specificationParams:[
                    {
                    id:1,
                    categoryId:5,
                    groupId:1,
                    name:'功能',
                    values:'计时码表，日期显示，夜光'
                    },
                    {
                        id:1,
                        categoryId:5,
                        groupId:1,
                        name:'表扣',
                        values:'蝴蝶扣，纽扣'
                    }
                    ]
            }]
        }),
        methods: {
            queryCategories() {
                this.axios.get('/goods/categories').then(result => {
                    this.categories = result.data
                })
            },
            // 选中左侧分类的树形节点
            selectCategory(data,node){
                console.log(data)
                console.log(node)
                if (data.raw.isLeaf){
                    this.selectedCategory = data
                    this.axios.get(`category/${this.selectedCategory.id}/specification/groups`).then(result=>{
                        this.specificationGroups = result.data
                    })
                }
            }
        },
        created() {
            this.queryCategories()
        }
    }
</script>

<style scoped>

</style>