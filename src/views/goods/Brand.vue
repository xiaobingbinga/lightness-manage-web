<template>
    <div>
        <!--面包屑导航-->
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品品牌</el-breadcrumb-item>
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
                    <el-button type="primary" @click="addBrandDialogVisible = true">新增品牌</el-button>
                    <el-button type="primary">导出品牌</el-button>
                </div>
            </div>
            <!--表格-->
            <el-table :data="pageInfo.list">
                <el-table-column label="编号" prop="id"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="图标LOGO" prop="image"></el-table-column>
                <el-table-column label="首字母" prop="letter"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template>
                        <el-button type="text" size="mini" icon="el-icon-edit" style="margin-right: 10px;"></el-button>
                        <el-button type="text" size="mini" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页条-->
            <el-pagination :page-size="pageInfo.pageSize"
                           :total="pageInfo.total"
                           :current-page.sync="pageInfo.pageNum"
                           @current-change="queryBrands"
                           style="margin-top: 20px;">
            </el-pagination>

        </div>

        <!--模态框-->
        <el-dialog title="新增品牌" :visible.sync="addBrandDialogVisible">
            <brand-form ref="brandForm" @get-form-data="getFormData"></brand-form>
            <div slot="footer">
                <el-button @click="addBrandDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    // import brands from "../../brand";
    // import brands from "@/brand.js";

    import BrandForm from "./BrandForm";
    export default {
        name: "Brand",
        components: {BrandForm},
        data:()=>({
            // brands:[],
            pageInfo:{},
            // 过滤的关键词
            filterWords:'',
            // 添加的模态框
            addBrandDialogVisible:false,
            addBrand:{
                name: '',
                image: '',
                letter: '',
                categoryId: ''
            }
        }),
        created() {
            this.queryBrands()
        },
        methods:{
            refresh(){
                this.pageInfo.pageNum = 1
                this.filterWords = ''
                this.queryBrands()
            },
            search(){
                // 修改查询的叶蛾属
                this.pageInfo.pageNum = 1
                this.queryBrands()
            },
            // 查询品牌的数据
            queryBrands(){
                // 构建查询的参数
                let config = {
                    params:{
                        pageNum: this.pageInfo.pageNum,
                        pageSize: this.pageInfo.pageSize,
                        filterWords: this.filterWords
                    }
                }
                this.axios.get("/brands",config).then(result=>{
                    // this.brands = result.data.list
                    this.pageInfo = result.data
                })
            },
            handleConfirm(){
                let validated = this.$refs.brandForm.validateForm()
                console.log(validated)
                console.log(typeof validated)
                if (validated){
                    this.axios.post('/brands/add',this.addBrand).then(result=>{
                        console.log(result)
                        this.queryBrands()
                        this.addBrandDialogVisible = false
                    })
                }else {
                    console.log('新增失败')
                    console.log(this.addBrand)
                    this.addBrandDialogVisible = false
                }
            },
            getFormData(addBrandData){
                this.addBrand = addBrandData
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-dialog__header{
        background-color: #409EFF;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    }
    /deep/ .el-dialog__title,
    /deep/ .el-dialog__close{
         color: #FFFFFF;
     }
</style>