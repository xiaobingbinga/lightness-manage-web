<template>
    <el-card>
        <template slot="header">
            <el-steps :active="step" simple>
                <el-step title="基本信息" icon="el-icon-edit"></el-step>
                <el-step title="规格参数" icon="el-icon-upload"></el-step>
                <el-step title="SKU属性" icon="el-icon-picture"></el-step>
                <el-step title="库存价格" icon="el-icon-picture"></el-step>
            </el-steps>
        </template>

        <div style="height: 400px;overflow: auto">
            <el-form :model="formModel" style="width: 95%;margin: 0 auto;">
                <!--基本信息-->
                <div v-show="step == 0">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="商品类目" prop="categoryId">
                                <el-cascader v-model="categoryIds"
                                             class="w-100"
                                             :options="categories"
                                             :props="categoryProps"
                                             placeholder="请选择商品分类">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属品牌" prop="brandId">
                                <el-select class="w-100"
                                           v-model="formModel.brandId"
                                           filterable
                                           placeholder="选择商品分类，支持首字母和名称模糊查询">
                                    <el-option v-for="brand in brands"
                                               :key="brand.id"
                                               :label="brand.name"
                                               :value="brand.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="formModel.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述">
                        <el-input v-model="formModel.description" type="textarea" style="height: 300px;"></el-input>
                    </el-form-item>
                </div>
                <!--规格参数-->
                <div v-show="step == 1">
                    <el-collapse v-for="group in specificationGroups" :key="group.id">
                        <el-collapse-item :title="group.name || '基础属性'">
                            <template v-for="param in group.params">
                                <el-form-item :label="param.name" :key="param.id" v-if="param.generic">
                                    <template v-if="param.values">
                                        <el-checkbox border v-for="value in param.values.split(',')" :key="value">
                                            <span :title="value">{{value}}</span>
                                        </el-checkbox>
                                    </template>
                                    <template v-else>
                                        <el-input>
                                            <i slot="suffix" class="el-input__icon" v-if="param.unit">单位：（{{param.unit}}）</i>
                                        </el-input>
                                    </template>
                                </el-form-item>
                            </template>
                        </el-collapse-item>
                    </el-collapse>
                </div>
                <!--SKU属性-->
                <div v-show="step == 2">
                    <!--循环规格参数的分组-->
                    <template v-for="group in specificationGroups">
                        <!--循环属性参数-->
                        <template v-for="param in group.params">
                            <!--判断是否是特殊的属性参数 - SKU -->
                            <el-form-item :label="param.name" :key="param.id" v-if="!param.generic">
                                <!--显示用户直接选择赋值得到属性参数-->
                                <template v-if="param.values">
                                    <el-checkbox border v-for="value in param.values.split(',')"
                                                 :key="value">
                                        <span :title="value">{{value}}</span>
                                    </el-checkbox>
                                </template>
                                <!--显示用户手动添加值得到属性参数-->
                                <template v-else>
                                    <!--循环显示已添加的属性值-->
                                    <el-input style="margin-bottom: 10px;"
                                              v-for="(value,index) in specialParams[param.id].values"
                                              :key="index"
                                              v-model="specialParams[param.id].values[index]">
                                        <!--显示单位的图标-->
                                        <i slot="suffix" class="el-input__icon"
                                           v-if="param.unit">单位：({{param.unit}})
                                        </i>
                                        <!--显示删除按钮图标-->
                                        <template slot="append">
                                            <el-button icon="el-icon-delete"></el-button>
                                        </template>
                                    </el-input>
                                    <!--显示用户手动输入值的文本框-->
                                    <el-input v-model="specialParams[param.id].newValue" placeholder="输入规格值">
                                        <template slot="append">
                                            <el-button icon="el-icon-plus" @click="addSkuValue(specialParams[param.id])"></el-button>
                                        </template>
                                    </el-input>
                                </template>
                            </el-form-item>
                        </template>
                    </template>
                </div>
                <!--库存价格-->
                <div v-show="step == 3">
                    <!--显示属性头-->
                    <el-table :data="skus">
                        <template v-for="(sku,index) in specialParams">
                            {{sku.name}}
                            <el-table-column :label="sku.name" :prop="sku.name" :key="index">

                            </el-table-column>
                        </template>
                        <el-table-column label="成本价">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.costPrice"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="销售价">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.price"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "GoodsForm",
        props: {
            step: {
                type: Number,
                default() {
                    return 0
                }
            }
        },
        data: () => ({
            categoryIds: [],
            categories: [],
            categoryProps: {
                value: 'id',
                label: 'text',
                // checkStrictly:false,
                // emitPath:true
            },
            brands: [],
            specificationGroups: [],
            formModel: {
                categoryId1: '',
                categoryId2: '',
                categoryId3: '',
                brandId: '',
                description: ''
            },
            // sku: {}
            specialParams:{},
            skus:[]
        }),
        created() {
            this.queryCategories()
        },
        watch: {
            categoryIds(cids) {
                if (cids.length == 3) {
                    console.log(cids)
                    this.formModel.categoryId1 = cids[0]
                    this.formModel.categoryId2 = cids[1]
                    this.formModel.categoryId3 = cids[2]
                    this.queryBrands(cids[2])
                    this.querySpecification(cids[2])
                    return
                }
                this.formModel.categoryId1 = ''
                this.formModel.categoryId2 = ''
                this.formModel.categoryId3 = ''
                this.brands = []
            },
            specificationGroups(groups) {
                // let sku = []
                // for (let group of groups) {
                //     for (let param of group.params) {
                //         sku.push({key: param.id, value: []})
                //     }
                // }
                // this.sku = sku
                let specialParams = {}
                for (let group of groups){
                    for (let param of group.params){
                        if (!param.generic){
                            specialParams[param.id] = {
                                name:param.name,
                                // 用户已经填写的值
                                values:[],
                                // 用户已填写但未添加的值
                                newValue:''
                            }
                        }
                    }
                }
                this.specialParams = specialParams
                console.log(this.specialParams)
            }
        },
        methods: {
            queryCategories() {
                this.axios.get('/goods/categories').then(result => {
                    this.categories = result.data
                })
            },
            // 查询品牌
            queryBrands(categoryId) {
                // this.brandsLoading = true
                this.axios.get(`/categories/${categoryId}/brands`).then(result => {
                    this.brandsLoading = false
                    this.brands = result.data
                })
            },
            // 查询规格
            querySpecification(categoryId) {
                this.axios.get(`category/${categoryId}/specification/groups`).then(result => {
                    console.log(result)
                    this.specificationGroups = result.data
                })
            },
            addSkuValue(sku) {
                // 判断是否输入值
                if (sku.newValue == ''){
                    return
                }
                console.log(sku)
                sku.values.push(sku.newValue)
                sku.newValue = ''
                this.calcSku()
            },
            calcSku(){
                let skus = []
                let names = []
                for (let id in this.specialParams){
                    skus.push(this.specialParams[id].values)
                    names.push(this.specialParams[id].name)
                }
                let result = skus.reduce((prev,current)=>{
                    let values = []
                    for (let prevValue of prev){
                        for (let currentValue of current){
                            values.push(prevValue + ':' + currentValue)
                        }
                    }
                    return values
                })
                let skuData = []
                for (let i = 0; i < result.length; i++){
                    let values = result[i].split(':')
                    let objData = {}
                    for (let i in names){
                        objData[names[i]] = values[i]
                    }
                    objData.price = 0
                    objData.costPrice = 0
                    skuData.push(objData)
                }
                this.skus = skuData
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-form-item__content {
        margin-top: 40px;
    }

    /deep/ .el-checkbox.is-bordered {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    /deep/ .el-checkbox__input {
        vertical-align: top;
        position: relative;
        top: 2px;
    }

    /deep/ .el-checkbox__label span {
        display: inline-block;
        width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>