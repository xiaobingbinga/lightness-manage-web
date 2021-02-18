<template>
    <div>
        <!--面包屑导航-->
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-table :data="resources"
                  row-key="id"
                  :tree-props="resourceProps"
                  :default-expand-all="true">
            <el-table-column label="#" width="30px"></el-table-column>
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <i class="fa-fw" :class="scope.row.icon"></i>
                    {{scope.row.text}}
                </template>
            </el-table-column>
            <el-table-column label="URL地址" prop="href"></el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <template v-if="scope.row.raw.type==1">
                        菜单
                    </template>
                    <template v-else-if="scope.row.raw.type==2">
                        按钮
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="图标">
                <template slot-scope="scope">
                    <i class="fa-fw" :class="scope.row.icon"></i>
                    {{scope.row.icon}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click="openEditDialog(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    export default {
        name: "Resource",
        data:()=>({
            resources:[],
            resourceProps:{
                children:'children'
            }
        }),
        created() {
            this.queryResources()
        },
        methods:{
            queryResources(){
                this.axios.get('/resources').then(result=>{
                    this.resources = result.data
                })
            },
            openEditDialog(id){
                console.log(id);
            }
        },

    }
</script>

<style scoped>

</style>