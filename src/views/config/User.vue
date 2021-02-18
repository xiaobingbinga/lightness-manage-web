<template>
    <div>
        <!--面包屑导航-->
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
                    <el-button type="primary">新增账户</el-button>
                </div>
            </div>
            <!--表格-->
            <el-table :data="pageInfo.list">
                <el-table-column label="用户账号" prop="account"></el-table-column>
                <el-table-column label="手机号码" prop="phone"></el-table-column>
                <el-table-column label="电子邮箱" prop="email"></el-table-column>
                <el-table-column label="是否启用" prop="disabled">
                    <template slot-scope="scope">
                        <el-switch :value="!scope.row.disabled"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"
                                   icon="el-icon-lock"
                                   @click="openPermissionDialog(scope.row.id)"
                                   style="margin-right: 10px;">授权
                        </el-button>
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
                           @current-change="queryUsers"
                           style="margin-top: 20px;">
            </el-pagination>
        </div>

        <el-dialog title="角色授权" :visible.sync="permissionDialogVisible" width="750px">
            <el-transfer
                    v-model="selectedRoleIds"
                    :data="roles"
                    :props="roleProps"
                    :titles="['未授权角色','已授权角色']"
                    :button-texts="['移除角色','添加角色']"
                    style="width: 100%;display: flex;justify-content: space-between;align-items: center;">
            </el-transfer>
            <div slot="footer">
                <el-button type="primary" @click="confirmPermission">确定</el-button>
                <el-button @click="permissionDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "User",
        data: () => ({
            pageInfo: {},
            // 所有的角色数据
            roles: [],
            // 已选中的角色编号
            selectedRoleIds: [],
            // 默认选中的角色编号
            defaultRoleIds: [],
            currentUserId: '',
            permissionDialogVisible: false,
            roleProps: {
                key: 'id',
                label: 'name',
                disabled: 'disabled'
            },
            filterWords: '',
        }),
        created() {
            this.queryUsers()
        },
        methods: {
            // 查询所有用户
            queryUsers() {
                let config = {
                    params: {
                        pageNum: this.pageInfo.pageNum,
                        pageSize: this.pageInfo.pageSize,
                        filterWords: this.filterWords
                    }
                }
                this.axios.get('/users', config).then(result => {
                    this.pageInfo = result.data
                })
            },
            openPermissionDialog(userId) {
                this.currentUserId = userId
                // 查询所有角色
                this.axios.get('/roles', {params: {pageSize: 0}}).then(result => {
                    this.roles = result.data.list
                })
                // 查询用户拥有的角色
                this.axios.get(`/users/${userId}/roles`).then(result => {
                    this.defaultRoleIds = []
                    let userRoles = result.data
                    let roleIds = []
                    for (let userRole of userRoles) {
                        roleIds.push(userRole.roleId)
                        this.defaultRoleIds.push(userRole.roleId)
                    }
                    this.selectedRoleIds = roleIds
                })
                this.permissionDialogVisible = true
            },
            search() {
                this.pageInfo.pageNum = 1
                this.queryUsers()
            },
            refresh() {
                this.pageInfo.pageNum = 1
                this.filterWords = ''
                this.queryUsers()
            },
            confirmPermission() {
                console.log(this.selectedRoleIds)

                let needAddRoleIds = []
                let needDeleteRoleIds = []

                for (let currentId of this.selectedRoleIds) {
                    if (!this.defaultRoleIds.includes(currentId)) {
                        needAddRoleIds.push(currentId)
                    }
                }
                console.log(needAddRoleIds)

                for (let defaultId of this.defaultRoleIds){
                    if (!this.selectedRoleIds.includes(defaultId)){
                        needDeleteRoleIds.push(defaultId)
                    }
                }
                console.log(needDeleteRoleIds)

                let data = {
                    addRoleIds: needAddRoleIds,
                    deleteRoleIds: needDeleteRoleIds
                }
                this.axios.put(`/users/${this.currentUserId}/permission`, data).then(() => {
                    this.permissionDialogVisible = false
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