<template>
    <div>
        <!--面包屑导航-->
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <!--工具栏-->
            <div style="display: flex">
                <el-form :inline="true" :model="conditionModel" ref="conditionForm">
                    <el-form-item prop="name">
                        <el-input v-model="conditionModel.name"
                                  placeholder="支持名称模糊查询">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="categoryIds">
                        <el-cascader v-model="conditionModel.categoryIds"
                                     :options="categories"
                                     :props="categoryProps"
                                     placeholder="请选择商品分类">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item prop="brandId">
                        <el-select v-model="conditionModel.brandId" filterable remote
                                   :remote-method="queryBrands"
                                   placeholder="选择品牌，支持首字母和名称模糊查询">
                            <el-option v-for="brand in brands"
                                       :key="brand.id"
                                       :label="brand.name"
                                       :value="brand.id"
                                       :loading="brandsLoading">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="queryGoods">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="reset">重置条件</el-button>
                    </el-form-item>
                </el-form>
                <div style="margin-left: auto">
                    <el-button type="primary" icon="el-icon-refresh">刷新</el-button>
                    <el-button type="primary" @click="addGoodsDialogVisible = true">新增商品</el-button>
                </div>
            </div>
            <!--表格-->
            <el-table :data="pageInfo.list">
                <el-table-column label="编号" prop="id" width="100px" align="center"></el-table-column>
                <el-table-column label="名称" align="center">
                    <template slot-scope="scope">
                        <span :title="scope.row.name" style="white-space: nowrap;overflow: auto;text-overflow: ellipsis;">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="分类" prop="categoryName" width="300px" align="center"></el-table-column>
                <el-table-column label="品牌" prop="brandName" width="300px" align="center"></el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template>
                        <el-button type="text" icon="el-icon-edit"></el-button>
                        <el-button type="text" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination style="margin-top: 20px"
                           :total="pageInfo.total"
                           :page-size="pageInfo.pageSize"
                           :current-page.sync="pageInfo.pageNum"
                           @current-change="queryGoods">
            </el-pagination>
        </div>

        <el-dialog title="新增商品" :visible.sync="addGoodsDialogVisible">
            <goods-form :step="step"></goods-form>
            <div slot="footer">
                <el-button @click="step --" :disabled="step==0">上一步</el-button>
                <el-button @click="step ++" v-if="step==3">保存</el-button>
                <el-button @click="step ++" :disabled="step==3" v-else>下一步</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import GoodsForm from "./GoodsForm";
    export default {
        name: "Goods",
        components: {GoodsForm},
        data:()=>({
            categories:[],
            categoryProps:{
                value:'id',
                label:'text',
                // checkStrictly:true,
                // emitPath:false
            },
            brands:[],
            brandsLoading:false,
            // 条件模型
            conditionModel:{
                name:'',
                categoryIds:[],
                categoryId:'',
                brandId:''
            },
            pageInfo:{},
            addGoodsDialogVisible:false,
            step:0
        }),
        created() {
            this.queryCategories()
            this.queryGoods()
        },
        watch:{
            ['conditionModel.categoryIds'](cids){
                if (cids.length){
                    this.conditionModel.categoryId = cids[cids.length - 1]
                }else{
                    this.conditionModel.categoryId = ''
                }
            }
        },
        computed:{
            condition(){
                return {
                    name: this.conditionModel.name,
                    categoryId: this.conditionModel.categoryId,
                    brandId: this.conditionModel.brandId,
                    pageNum: this.pageInfo.pageNum,
                    pageSize: this.pageInfo.pageSize
                }
            }
        },
        methods:{
            queryCategories(){
                this.axios.get('/goods/categories').then(result=>{
                    this.categories = result.data
                })
            },
            // 查询品牌
            queryBrands(filterWords){
                if (filterWords == ''){
                    this.brands = []
                    return
                }
                this.brandsLoading = true
                this.axios.get(`/brands/filter/${filterWords}`).then(result=>{
                    this.brandsLoading = false
                    this.brands = result.data
                })
            },
            // 重置查询条件
            reset(){
                this.$refs.conditionForm.resetFields()
            },
            queryGoods(){
                let config = {
                    params:this.condition
                }
                this.axios('/goods/list',config).then(result=>{
                    this.pageInfo = result.data
                })
            }
        }
    }
</script>

<style scoped>

</style>