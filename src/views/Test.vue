<template>
    <div>
        <h3>测试组件</h3>
        <p>{{$store.state.user.account}}</p>
        <p>{{account}}</p>
        <p>直接使用store<input v-model="$store.state.user.account" /></p>
        <p>使用getters属性<input v-model="account" /></p>
        <p>使用state属性<input v-model="user.account" /></p>
        <p>{{queryRoleById(1)}}</p>

        <p>
            {{user.password}}
            <button @click="change">修改密码</button>
        </p>

    </div>
</template>

<script>

    // 导入辅助函数
    import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

    // 对象展开运算符
    // let obj1 = {name:'张三'}
    // let obj2 = {age:20}
    // let obj = {...obj1,...obj2}
    // console.log(obj)


    export default {
        name: "Test",

        computed:{
            ...mapState([
                'user'
            ]),
            ...mapGetters([
                'account',
                'queryRoleById'
            ]),
            selt(){
                return ''
            }
        },
        created() {
            console.log(this);
        },
        methods:{
            ...mapMutations([
                'updatePassword'
            ]),
            ...mapActions([
                'updatePass'
            ]),
            async change(){
                // this.updatePassword('aaaaaa')
                // this.$store.commit('updatePassword','aaaaaa')
                // this.updatePass('aaaaaa')
                // this.$store.dispatch('updatePass','aaaaaa').then(()=>{
                //     console.log('修改成功')
                // })
                // 等待异步的方法执行完成后，才执行后续的操作
                await this.$store.dispatch('updatePass','aaa')
                console.log('修改成功')
            }
        }

        // computed:mapState(['user'])

        // computed:mapState({
        //     account: state => state.user.account,
        //     user:'user'
        // })

        // computed:{
        //     // account(){
        //     //     return this.$store.state.user.account
        //     // },
        //
        //     // 普通的计算属性
        //     // account:()=>this.$store.state.user.account
        //
        //     // 含有get和set的计算属性，可以使用v-model绑定
        //     account:{
        //         // get:function(){return this.$store.state.user.account},
        //         // set:function(value){this.$store.state.user.account = value}
        //         get(){return this.$store.state.user.account},
        //         set(value){this.$store.state.user.account = value}
        //     }
        // }
    }
</script>

<style scoped>

</style>