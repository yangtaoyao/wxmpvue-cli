var baseUrl = process.env.API_BASE_URL

var config = {

    // 下面的地址配合云端 Demo 工作
    baseUrl,

        // 登录地址，用于建立会话
        loginUrl: `${baseUrl}login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${baseUrl}/user`,

        // 测试的信道服务地址
        tunnelUrl: `${baseUrl}/tunnel`,

        // 上传图片接口
        uploadUrl: `${baseUrl}/upload`,


        QQMapWXKey:'QXYBZ-JB3H6-LM4SH-EUC6L-4N3WZ-Q3BCQ'
};

export default  config;