<template>
    <div>
        <!--面包屑导航-->
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!--表单、表格、分页条-->
        <div>
            <!--搜索框和工具按钮-->
            <div style="display: flex;">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input v-model="filterWords">
                            <template slot="append">
                                <el-button icon="el-icon-search" @click="search"></el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-refresh" @click="refresh"></el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-left: auto">
                    <el-button type="primary" @click="openAddRoleDialog">新增角色</el-button>
                </div>
            </div>
            <!--表格-->
            <el-table :data="pageInfo.list">
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="是否启用" prop="disabled">
                    <template slot-scope="scope">
                        <el-switch :value="!scope.row.disabled"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"
                                   icon="el-icon-lock"
                                   @click="openResourceDialog(scope.row.id)"
                                   style="margin-right: 10px;">授权</el-button>
                        <el-button type="text" size="mini"
                                   :icon="scope.row.disabled ? 'el-icon-success' : 'el-icon-remove'"
                                   style="margin-right: 10px;color: red;"></el-button>
                        <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px;"></el-button>
                        <el-button type="text" size="mini" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页条-->
            <el-pagination :page-size="pageInfo.pageSize"
                           :total="pageInfo.total"
                           :current-page.sync="pageInfo.pageNum"
                           @current-change="queryRoles"
                           style="margin-top: 20px;">
            </el-pagination>
        </div>

        <el-dialog title="角色资源分配" :visible.sync="setResourceDialogVisible">
            <!--设置树形节点的默认选中-->
            <el-tree ref="resourceTree"
                     :data="resources"
                     :props="resourceProps"
                     show-checkbox
                     check-strictly
                     :default-checked-keys="selectedResourceIds"
                     node-key="id"></el-tree>
            <div slot="footer">
                <el-button type="primary" @click="confirmResource">确定</el-button>
                <el-button @click="setResourceDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible">
            <el-form ref="roleAddForm" :model="addRoleModel" :rules="addRoleRules">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addRoleModel.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input v-model="addRoleModel.description"></el-input>
                </el-form-item>
                <el-form-item label="是否禁用" prop="disabled">
                    <el-switch v-model="addRoleModel.disabled"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="handleAddRole">添加</el-button>
                <el-button @click="addRoleDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Role",
        data:()=>({
            pageInfo:{},
            resources:[],
            selectedResourceIds:[],
            setResourceDialogVisible:false,
            resourceProps:{
                children:'children',
                label: 'text'
            },
            filterWords:'',
            // 当前操作的角色编号
            currentRoleId:'',
            addRoleDialogVisible:false,
            addRoleModel:{
                name:'',
                description:'',
                disabled:false
            },
            addRoleRules:{
                name:[{required:true,message:'角色名称必填'}]
            }
        }),
        created() {
            this.queryRoles()
        },
        computed:{},
        methods:{
            queryRoles(){
                let config = {
                    params:{
                        pageNum: this.pageInfo.pageNum,
                        pageSize: this.pageInfo.pageSize,
                        filterWords: this.filterWords
                    }
                }
                this.axios.get('/roles',config).then(result=>{
                    this.pageInfo = result.data
                })
            },
            openResourceDialog(roleId){
                this.currentRoleId = roleId
                this.axios.get(`/roles/${roleId}/resources`).then(result=>{
                    let roleResource = result.data
                    let resourceIds = []
                    for (let roleRes of roleResource){
                        resourceIds.push(roleRes.resourceId)
                    }
                    this.selectedResourceIds = resourceIds
                })

                this.axios.get('/resources').then(result=>{
                    this.setResourceDialogVisible = true
                    this.resources = result.data
                })
            },
            search(){
                this.pageInfo.pageNum = 1
                this.queryRoles()
            },
            refresh(){
                this.pageInfo.pageNum = 1
                this.filterWords = ''
                this.queryRoles()
            },
            confirmResource(){
                let needDeleteResourceIds = []
                let needAddResourceIds = []
                // 获取当前树形结构中选中的节点
                let currentSelectedResourceIds = this.$refs.resourceTree.getCheckedKeys();
                console.log(currentSelectedResourceIds)
                // 当前选中的节点不在原始的默认选中节点中，表示是新增的节点
                for (let currentId of currentSelectedResourceIds){
                    if (!this.selectedResourceIds.includes(currentId)){
                        needAddResourceIds.push(currentId)
                    }
                }
                console.log(needAddResourceIds);

                // 原始的默认选中节点不在当前选中的节点中，表示是删除的节点
                for (let defaultId of this.selectedResourceIds){
                    if (!currentSelectedResourceIds.includes(defaultId)){
                        needDeleteResourceIds.push(defaultId)
                    }
                }
                console.log(needDeleteResourceIds);

                let data = []

                for (let addResId of needAddResourceIds){
                    data.push({resourceId:addResId,addable:true})
                }
                for (let delResId of needDeleteResourceIds){
                    data.push({resourceId:delResId,addable:false})
                }
                console.log(data);
                let config = {
                    transformRequest:[function (data,headers) {
                        console.log('------------------data------------------')
                        console.log(data)
                        console.log(headers)
                        headers.put['Content-Type'] = 'application/json'
                        return JSON.stringify(data)
                    }]
                }
                this.axios.put(`/roles/${this.currentRoleId}/permission`,{roleResourceDTOS:data},config).then(()=>{
                    this.setResourceDialogVisible = false
                })
            },
            openAddRoleDialog(){
                this.addRoleDialogVisible = true
            },
            handleAddRole(){
                this.$refs.roleAddForm.validate(valid=>{
                    if (!valid){
                        return false
                    }
                    this.axios.post('/roles/add',this.addRoleModel).then(result=>{
                        console.log(result)
                        this.queryRoles()
                        this.addRoleDialogVisible = false
                    })
                })
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-dialog__header {
        background-color: #409EFF;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    }

    /deep/ .el-dialog__title,
    /deep/ .el-dialog__close {
        color: #FFFFFF;
        font-weight: bold;
    }
</style>