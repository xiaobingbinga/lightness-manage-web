<template>
    <el-form-item :label="label" :prop="prop">
        <el-cascader @change="sendValue"
                v-model="value"
                :options="categories"
                :props="casProps"
                style="width: 100%"
                clearable>
        </el-cascader>
    </el-form-item>
</template>

<script>
    export default {
        name: "CategoryCascader",
        props:['label','prop'],
        data:()=>({
            categories: [],
            treeProps: {
                children: 'children',
                label: 'text'
            },
            casProps:{
                value:'id',
                label:'text',
                children:'children',
                // checkStrictly: true,
                emitPath:false
            },
            value:0
        }),
        methods:{
            queryCategories() {
                this.axios.get('/goods/categories').then(result => {
                    this.categories = result.data
                })
            },
            sendValue(){
                this.$emit('get-category-id',this.value)
            }
        },
        mounted() {
            this.queryCategories();
        }
    }
</script>

<style scoped>

</style>