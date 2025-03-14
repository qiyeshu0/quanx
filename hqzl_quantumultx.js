/**
 * 红旗智联Token捕获脚本 - Quantumult X版本
 * 
 * 使用方法：
 * 1. 在Quantumult X中添加以下重写规则：
 *    hostname = hqapp.faw.cn
 *    ^https:\/\/hqapp\.faw\.cn\/fawcshop\/auth\/v1\/login url script-response-body https://github.com/qiyeshu0/quanx/raw/refs/heads/main/hqzl_quantumultx.js
 * 
 * 2. 打开红旗智联APP，使用账号密码登录
 * 3. 登录成功后，脚本会自动捕获Token并保存
 * 4. 查看通知获取Token保存状态
 * 
 * 作者: @临渊
 */

// 配置信息
const config = {
    // 保存Token的键名
    tokenKey: 'hqzl_token',
    // 日志级别: 0-不输出, 1-仅输出重要信息, 2-输出所有信息
    logLevel: 2,
    // 是否通知Token保存结果
    enableNotification: true
};

// 日志函数
function log(message, level = 1) {
    if (config.logLevel >= level) {
        console.log(`[红旗智联Token] ${message}`);
    }
}

// 通知函数
function notify(title, message) {
    if (config.enableNotification && typeof $notify !== 'undefined') {
        $notify(title, '', message);
    }
}

// 主函数
function main() {
    try {
        const body = JSON.parse($response.body);
        log(`获取到响应数据: ${JSON.stringify(body)}`, 2);
        
        if (body.code === '000000' && body.data) {
            // 提取Token和aid
            const authorization = body.data.token;
            const aid = body.data.aid;
            
            if (authorization && aid) {
                // 保存Token信息
                const tokenInfo = {
                    authorization: authorization,
                    aid: aid,
                    updateTime: new Date().toLocaleString()
                };
                
                $prefs.setValueForKey(JSON.stringify(tokenInfo), config.tokenKey);
                
                log(`Token保存成功: ${authorization.substring(0, 15)}...`);
                log(`Aid保存成功: ${aid}`);
                
                notify('红旗智联Token获取成功', `Token已保存，可以使用自动化脚本了`);
            } else {
                log('响应中未找到有效的Token或aid');
                notify('红旗智联Token获取失败', '响应中未找到有效的Token或aid');
            }
        } else {
            log(`响应状态码异常: ${body.code}, 消息: ${body.msg}`);
            notify('红旗智联Token获取失败', `响应状态码异常: ${body.code}`);
        }
    } catch (e) {
        log(`处理响应时出错: ${e}`);
        notify('红旗智联Token获取失败', `处理响应时出错: ${e}`);
    }
    
    // 不修改原始响应
    return $response.body;
}

// 执行主函数
const result = main();
$done({body: result}); 
