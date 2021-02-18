<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品品牌</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card shadow="never">
            <div slot="header">
                <span>商品分类</span>
            </div>
            <div class="d-flex">
                <el-form :inline="true">
                    <el-form-item>
                        <el-input placeholder="输入关键字搜索">
                            <template slot="append">
                                <el-button>搜索</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div style="margin-left: auto">
                    <el-button>新增品牌</el-button>
                </div>
            </div>

            <el-table :data="brands" border="border">
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="image" label="品牌图标"></el-table-column>
                <el-table-column prop="letter" label="首字母"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editBrand(scope.row)">编辑</el-button>
                        <el-button size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog :title="dialogTile" :visible.sync="dialogVisible" width="400px">
                <div slot="title" style="">
                    {{dialogTile}}
                </div>
                <brand-form ref="brandForm" :formModel="brandModel" style=""></brand-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>

    import brands from "../../brand";
    import BrandForm from "./BrandForm";

    export default {
        name: "Brand",
        components: {BrandForm},
        data: () => ({
            brands, // 品牌数据
            isEdit: false, // 是否编辑
            dialogVisible: false, // 模态框是否显示
            brandModel: null, // 需要编辑的品牌信息
        }),
        computed: {
            dialogTile() {
                return this.isEdit ? '修改品牌' : '新增品牌';
            }
        },
        methods: {
            editBrand(brand) {
                this.isEdit = true;
                // 根据品牌查询信息,绑定到需要编辑的属性上
                this.brandModel = brand;
                // 显示模态框
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-dialog__header .el-dialog__close {
        font-weight: bold;
        color: #FFF;
    }

    /deep/ .el-dialog__header {
        padding-bottom: 20px;
        font-weight: bold;
        color: #FFF;
        background-color: #409EFF;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
    }

    /deep/ .el-dialog__body {
        /*padding-top: 10px;*/
    }
</style>