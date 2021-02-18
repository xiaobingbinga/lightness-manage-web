// vue的配置
module.exports = {
    // 设置开发服务器
    devServer:{
        // 主机地址
        host: 'www.qingying.com',
        // 配置端口号
        port: 80,
        // 绕过主机检查
        disableHostCheck:true,
        // 启动时打开浏览器
        open: true,
        // proxy:{
        //     '/api':{
        //         target:'http://www.qingying.com:8080',
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite:{
        //             '^/api':''
        //         }
        //     }
        // }
    }
}