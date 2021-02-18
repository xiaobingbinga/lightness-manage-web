<template>
    <div>
        <div style="background-color: #EBEEF5;margin: -20px -20px 20px;padding: 20px">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 20px;">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tree :data="categories" :props="treeProps" empty-text="emptyText">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <i :class="{'el-icon-folder':!data.raw.isLeaf,'el-icon-document':data.raw.isLeaf}"></i>
                <span class="custom-tree-text">{{data.text}}</span>
                <span class="tool-bar">
                    <el-button v-if="!data.raw.isLeaf" type="text" size="mini" icon="el-icon-plus"
                               @click.stop="handleAdd(data.id)"></el-button>
                    <el-button type="text" size="mini" icon="el-icon-edit"
                               @click.stop="handleEdit(data.id)"></el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete"
                               @click.stop="handleDelete(data.id)"></el-button>
                </span>
            </span>
        </el-tree>

        <!--新增的模态框-->
        <el-dialog title="商品类目新增" :visible.sync="addCategoryDialogVisible" width="30%">
            <el-form ref="categoryForm" :model="addCategoryModel" :rules="addCategoryRules">
                <el-form-item label="类目名称" prop="name">
                    <el-input v-model="addCategoryModel.name"></el-input>
                </el-form-item>
                <el-form-item label="所属父级类目" prop="parentId">
                    <el-cascader v-model="addCategoryModel.parentId"
                                 :options="parentCategories" :props="casProps"
                                 class="w-100">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="能否添加子类目" prop="leaf">
                    <el-select v-model="addCategoryModel.isLeaf" class="w-100">
                        <el-option value="false" label="能"></el-option>
                        <el-option value="true" label="不能"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="界面显示序号" prop="sort">
                    <el-input v-model="addCategoryModel.sort"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddCategory">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑的模态框-->
        <el-dialog title="商品类目修改" :visible.sync="editCategoryDialogVisible" width="30%">
            <el-form ref="categoryEditForm" :model="editCategoryModel" :rules="editCategoryRules">
                <el-form-item label="类目名称" prop="name">
                    <el-input v-model="editCategoryModel.name"></el-input>
                </el-form-item>
                <el-form-item label="所属父级类目" prop="parentId">
                    <el-cascader v-model="editCategoryModel.parentId"
                                 :options="parentCategories" :props="casProps" class="w-100">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="能否添加子类目" prop="leaf">
                    <el-select v-model="editCategoryModel.isLeaf" class="w-100">
                        <el-option value="false" label="能"></el-option>
                        <el-option value="true" label="不能"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="界面显示序号" prop="sort">
                    <el-input v-model="editCategoryModel.sort"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditCategory">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "Category",
        data: () => ({
            categories: [],
            parentCategories: [],
            treeProps: {
                children: 'children',
                label: 'text'
            },
            emptyText:'暂无商品分类数据',
            addCategoryDialogVisible:false,
            addCategoryModel:{
                name:'',
                parentId:0,
                isLeaf:'false',
                sort:''
            },
            addCategoryRules:{
                name:[
                    {required:true,message:'类目名称必填'}
                ]
            },
            casProps:{
                value:'id',
                label:'text',
                children:'children',
                checkStrictly: true,
                emitPath:false
            },
            // 修改模态框数据
            editCategoryDialogVisible:false,
            editCategoryModel:{
                id:'',
                name:'',
                parentId:0,
                isLeaf:'false',
                sort:''
            },
            editCategoryRules:{
                name:[{required:true,message:'类目名称必填'}]
            }
        }),
        methods: {
            queryCategories() {
                this.axios.get('/goods/categories').then(result => {
                    this.categories = result.data
                })
            },
            queryParentCategories(){
                this.axios.get('/goods/parentCategories').then(result => {
                    this.parentCategories = result.data
                })
            },
            handleAdd(parentId) {
                this.queryParentCategories();
                // 设置数据
                this.addCategoryModel.parentId = parentId;
                // 打开模态框
                this.addCategoryDialogVisible = true
            },
            handleAddCategory(){
                this.$refs.categoryForm.validate(valid=>{
                    if (!valid){
                        return false
                    }
                    this.axios.post('/goods/category',this.addCategoryModel).then((result)=>{
                        this.queryCategories()
                        console.log(result)
                        this.addCategoryDialogVisible = false
                    })
                });
            },
            // 打开编辑模态框
            handleEdit(id){
                this.queryParentCategories();
                this.axios.get('/goods/queryById',{params:{id:id}}).then(result=>{
                    console.log(result);
                    this.editCategoryModel.id = result.data.id
                    this.editCategoryModel.name = result.data.name
                    this.editCategoryModel.parentId = result.data.parentId
                    this.editCategoryModel.isLeaf = result.data.isLeaf.toString()
                    this.editCategoryModel.sort = result.data.sort
                    this.editCategoryDialogVisible = true
                }).catch(result=>{
                    console.log(result);
                })
            },
            handleEditCategory(){
                console.log(this.editCategoryModel)
                this.$refs.categoryEditForm.validate(valid=>{
                    if (!valid){
                        return false
                    }
                    this.axios.post("/goods/update",this.editCategoryModel).then(result=>{
                        console.log(result);
                        this.queryCategories()
                        this.editCategoryDialogVisible = false
                    }).catch(reason => {
                        console.log(this.editCategoryModel)
                        console.log(reason)
                    })
                })
            },
            handleDelete(id){
                window.alert(id + "无法删除！该功能尚未实现！！！")
            }

        },
        created() {
            this.queryCategories()
        }
    }
</script>

<style scoped>
    /deep/ .el-tree-node__content {
        line-height: 40px;
        height: 40px;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        /*justify-content: space-between;*/
        font-size: 14px;
        padding-right: 8px;
    }

    .custom-tree-text {
        margin-left: 7px;
    }

    .tool-bar {
        margin-left: auto;
    }

    .tool-bar > * {
        margin-left: 15px;
    }
</style>