module.exports = {
    publicPath: '/', //基本路径
    outputDir: 'dist', //打包的包文件名
    assetsDir: 'static', //css、js、img静态资源存放文件夹
    lintOnSave: false, //是否在保存的时候使用 `eslint-loader` 进行检查。默认true
    runtimeCompiler: false, //是否使用包含运行时编译器的 Vue 构建版本。默认false
    productionSourceMap: false, //生产环境不需要 source map,加速生产环境构建。默认true

    devServer: { //webpack-dev-server配置
        host: 'localhost',
        port: 8080, //配置本项目运行端口
        proxy: { //配置代理服务器来解决跨域问题
            '/api': {
                target: 'http://localhost:3000', //配置要替换的后台接口地址
                changOrigin: true, //配置允许改变Origin
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
}