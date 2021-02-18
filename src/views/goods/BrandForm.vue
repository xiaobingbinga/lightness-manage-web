<template>
    <el-form ref="formModel" :model="formModel" :rules="formModelRules">
        <el-form-item prop="name" label="品牌名称">
            <el-input v-model="formModel.name" @input="sendData"></el-input>
        </el-form-item>

        <el-form-item prop="letter" label="品牌首字母">
            <el-input v-model="formModel.letter" @input="sendData"></el-input>
        </el-form-item>

        <!--        <el-form-item prop="categoryId" label="选择商品分类">-->
        <!--            <el-cascader style="width: 100%;"></el-cascader>-->
        <!--        </el-form-item>-->

        <category-cascader ref="CategoryCascader" label="选择商品分类" prop="categoryId" @get-category-id="getCategoryId"></category-cascader>

        <el-form-item prop="image" label="品牌图标">
            <el-upload name="image"
                       class="image-uploader"
                       :action="uploadServer"
                       :show-file-list="false"
                       :on-success="uploaded">
                <img v-if="formModel.image" :src="imageUrl" class="image">
                <i v-else class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
        </el-form-item>
    </el-form>
</template>

<script>
    import CategoryCascader from "./CategoryCascader";

    export default {
        name: "BrandForm",
        components: {CategoryCascader},
        // props:{
        //     formModel:{
        //         type:Object,
        //         default:()=>{
        //             return {
        //                 id:null,
        //                 name:'',
        //                 image:'',
        //                 letter:'',
        //                 categoryId:''
        //             }
        //         }
        //     }
        // },
        data: () => ({
            uploadServer: "http://www.qingying.com:8080/api/upload/images/brand",
            imageServer: 'http://images.qingying.com:8081/',

            formModel: {
                name: '',
                image: '',
                letter: '',
                categoryId: ''
            },
            formModelRules:{
                name:[{required:'true',message:'商品名称必填'}],
                letter:[{required:'true',message:'首字母必填'}]
            }
        }),
        computed: {
            imageUrl() {
                return this.imageServer + this.formModel.image
            }
        },
        methods: {
            uploaded(response) {
                console.log(response);
                this.formModel.image = response
                this.$emit('get-form-data', this.formModel)
            },
            getCategoryId(categoryId) {
                this.formModel.categoryId = categoryId
            },
            sendData() {
                this.$emit('get-form-data', this.formModel)
            },
            validateForm(){
                let flag = null
                this.$refs.formModel.validate(valid=>{
                    if (valid){
                        flag = true
                    }else {
                        flag = false
                    }
                })
                return flag
            }
        }
    }
</script>

<style scoped>
    .image-uploader /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100%;
    }

    .image-uploader /deep/ .el-upload:hover {
        border-color: #409EFF;
    }

    .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 138px;
        height: 138px;
        line-height: 138px;
        text-align: center;
    }

    .image {
        width: 138px;
        height: 138px;
        display: block;
    }
</style>