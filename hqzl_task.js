/**
 * 红旗智联自动化任务脚本 - Quantumult X版本
 * 
 * 使用方法：
 * 1. 先使用hqzl_quantumultx.js抓取Token
 * 2. 在Quantumult X中添加以下定时任务：
 *    0 9 * * * https://raw.githubusercontent.com/qiyeshu0/quanx/main/hqzl_task.js, tag=红旗智联, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/10010.png, enabled=true
 * 
 * 功能：
 * - 每日签到
 * - 分享任务
 * - 评论文章
 * - 发布问答和回答问题
 * - 发布动态
 * - 点赞任务
 * - 查询积分
 * 
 * 作者: @临渊
 */

// 配置信息
const config = {
    // 保存Token的键名
    tokenKey: 'hqzl_token',
    // 日志级别: 0-不输出, 1-仅输出重要信息, 2-输出所有信息
    logLevel: 2,
    // 是否通知任务结果
    enableNotification: true,
    // 请求超时时间(毫秒)
    timeout: 10000,
    // 请求间隔时间(毫秒)
    interval: 3000
};

// 全局变量
let token = '';
let aid = '';
let notice = '';
let contentIdArr = [];
let getArticlesBack = 0;
let getQuestionsBack = 0;
let questionId = 0;
let questionContent = '';
let questionIdArr = [];
let getDynamicBack = 0;
let dynamicContent = '';

// 日志函数
function log(message, level = 1) {
    if (config.logLevel >= level) {
        console.log(`[红旗智联] ${message}`);
    }
}

// 通知函数
function notify(title, message) {
    if (config.enableNotification && typeof $notify !== 'undefined') {
        $notify(title, '', message);
    }
}

// 延时函数
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// 随机整数生成
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 获取请求参数
function getParams(body) {
    let timestamp = Date.now();
    let nonce = generateUUID().replace(/-/g, '');
    let signature = getSignature(timestamp, nonce, body);
    return {
        timestamp: timestamp,
        nonce: nonce,
        signature: signature
    }
}

// 获取签名
function getSignature(timestamp, nonce, body) {
    let str = timestamp + nonce + JSON.stringify(body);
    let signature = $crypto.sha256(str).toString();
    return signature;
}

// 通用POST请求
async function commonPost(url, body) {
    let params = getParams(body);
    return new Promise((resolve) => {
        const options = {
            url: `https://hqapp.faw.cn${url}`,
            headers: {
                'Authorization': token,
                'aid': aid,
                'platform': '2',
                'o35xzbbp': 'qjzsuioa',
                'version': '5.0.3',
                'X-Feature': 'sprint3-demo',
                'anonymousId': 'f33b8c0033deea93',
                'timestamp': params.timestamp,
                'nonce': params.nonce,
                'signature': params.signature,
                'tenantId': '03001001',
                'Content-Type': 'application/json',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'user-agent': 'okhttp/4.9.2',
            },
            body: JSON.stringify(body)
        };
        
        $task.fetch(options).then(response => {
            try {
                const data = JSON.parse(response.body);
                resolve(data);
            } catch (e) {
                log(`解析响应失败: ${e}`, 1);
                resolve({});
            }
        }, reason => {
            log(`请求失败: ${reason.error}`, 1);
            resolve({});
        });
    });
}

// 评论POST请求
async function commentPost(url, body) {
    let params = getParams(body);
    return new Promise((resolve) => {
        const options = {
            url: `https://hqapp.faw.cn${url}`,
            headers: {
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'o35xzbbp': 'qjzsuioa',
                'Authorization': token,
                'aid': aid,
                'platform': '2',
                'version': '5.0.3',
                'Accept': '*/*',
                'Origin': 'https://hqapp.faw.cn',
                'X-Requested-With': 'com.sunao.qm.qm_android',
                'timestamp': params.timestamp,
                'nonce': params.nonce,
                'signature': params.signature,
                'Content-Type': 'application/json',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                'user-agent': 'okhttp/4.9.2',
            },
            body: JSON.stringify(body)
        };
        
        $task.fetch(options).then(response => {
            try {
                const data = JSON.parse(response.body);
                resolve(data);
            } catch (e) {
                log(`解析响应失败: ${e}`, 1);
                resolve({});
            }
        }, reason => {
            log(`请求失败: ${reason.error}`, 1);
            resolve({});
        });
    });
}

// 通用GET请求
async function commonGet(url) {
    return new Promise((resolve) => {
        const options = {
            url: `https://hqapp.faw.cn${url}`,
            headers: {
                'Authorization': token,
                'aid': aid,
                'platform': '2',
                'o35xzbbp': 'qjzsuioa',
                'version': '5.0.3',
                'X-Feature': 'sprint3-demo',
                'anonymousId': 'f33b8c0033deea93',
                'tenantId': '03001001',
                'Content-Type': 'application/json',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip',
                'user-agent': 'okhttp/4.9.2',
            }
        };
        
        $task.fetch(options).then(response => {
            try {
                const data = JSON.parse(response.body);
                resolve(data);
            } catch (e) {
                log(`解析响应失败: ${e}`, 1);
                resolve({});
            }
        }, reason => {
            log(`请求失败: ${reason.error}`, 1);
            resolve({});
        });
    });
}

// 获取文章列表
async function getArticles() {
    try {
        let postList = await commonGet('/fawcshop/cms/api/front/content/queryPostList?city=%E9%93%9C%E4%BB%81%E5%B8%82&stats=2&pageNo=1&pageSize=10');
        if (postList.code == '000000') {
            for (let i = 0; i < 2; i++) {
                contentIdArr.push(postList.data[i].contentId);
            }
            getArticlesBack = 1;
        } else {
            getArticlesBack = 0;
            log(`获取文章失败，不进行评论，原因是：${postList.msg}`);
        }
    } catch (e) {
        log(e);
        getArticlesBack = 0;
    }
}

// 评论文章
async function addComment(num) {
    try {
        let commentList = ['红旗，让理想飞扬','红旗加油，红旗棒！','红旗，遥遥领先！','支持红旗，加油！'];
        let comment = commentList[Math.floor(Math.random() * commentList.length)];
        log(`评论内容：${comment}`);
        
        let addComment = await commentPost('/fawcshop/collect-sns/v1/dynamicTopic/saveCommentDetailsRevision',{
            "commentContext": comment,
            "commentType": "8500",
            "contentId": contentIdArr[num],
            "parentId": "0",
            "fileString": []
        });
        
        if (addComment.code == '000000') {
            log(`评论[id=${contentIdArr[num]}]文章成功`);
        } else {
            log(`评论[id=${contentIdArr[num]}]文章失败，原因是：${addComment.msg}`);
        }
    } catch (e) {
        log(e);
    }
}

// 获取问答列表
async function getQuestions() {
    try {
        let result = await commonGet('/fawcshop/collect-sns/v1/question/getQuestionList?pageNo=1&pageSize=10&questionType=1');
        if (result.code == '000000') {
            getQuestionsBack = 1;
        } else {
            getQuestionsBack = 0;
            log(`获取问答失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
        getQuestionsBack = 0;
    }
}

// 发布问答
async function addQuestion() {
    try {
        let questionList = [
            "红旗H9怎么样？",
            "红旗H5值得购买吗？",
            "红旗E-HS9续航怎么样？",
            "红旗H6的驾驶感受如何？"
        ];
        questionContent = questionList[Math.floor(Math.random() * questionList.length)];
        log(`发布问题：${questionContent}`);
        
        let result = await commonPost('/fawcshop/collect-sns/v1/question/saveQuestion', {
            "questionContent": questionContent,
            "questionTitle": questionContent,
            "questionType": "1",
            "fileString": []
        });
        
        if (result.code == '000000') {
            log(`发布问答成功`);
        } else {
            log(`发布问答失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
    }
}

// 获取热门问答
async function getLikesQuestions() {
    try {
        let result = await commonGet('/fawcshop/collect-sns/v1/question/getQuestionList?pageNo=1&pageSize=10&questionType=2');
        if (result.code == '000000') {
            for (let i = 0; i < 2; i++) {
                questionIdArr.push(result.data.list[i].questionId);
            }
            getQuestionsBack = 1;
        } else {
            getQuestionsBack = 0;
            log(`获取热门问答失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
        getQuestionsBack = 0;
    }
}

// 获取问答评论
async function getLikesQuestionsComment(num) {
    try {
        questionId = questionIdArr[num];
        let result = await commonGet(`/fawcshop/collect-sns/v1/question/getQuestionDetail?questionId=${questionId}`);
        if (result.code == '000000') {
            getQuestionsBack = 1;
        } else {
            getQuestionsBack = 0;
            log(`获取问答评论失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
        getQuestionsBack = 0;
    }
}

// 回答问题
async function answerQuestion() {
    try {
        let answerList = [
            "我觉得非常好，值得推荐！",
            "性价比很高，外观设计很漂亮！",
            "动力很足，操控性很好！",
            "内饰做工精细，用料扎实！"
        ];
        let answer = answerList[Math.floor(Math.random() * answerList.length)];
        log(`回答问题[id=${questionId}]：${answer}`);
        
        let result = await commonPost('/fawcshop/collect-sns/v1/question/saveQuestionComment', {
            "commentContent": answer,
            "questionId": questionId,
            "fileString": []
        });
        
        if (result.code == '000000') {
            log(`回答问题成功`);
        } else {
            log(`回答问题失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
    }
}

// 获取动态列表
async function getDynamic() {
    try {
        let result = await commonGet('/fawcshop/collect-sns/v1/dynamicTopic/getDynamicTopicList?pageNo=1&pageSize=10');
        if (result.code == '000000') {
            getDynamicBack = 1;
        } else {
            getDynamicBack = 0;
            log(`获取动态失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
        getDynamicBack = 0;
    }
}

// 发布动态
async function addDynamic() {
    try {
        let dynamicList = [
            "今天天气真好，开着红旗出去兜风！",
            "红旗车主的快乐，你们懂吗？",
            "红旗，中国汽车品牌的骄傲！",
            "刚保养完爱车，状态焕然一新！"
        ];
        dynamicContent = dynamicList[Math.floor(Math.random() * dynamicList.length)];
        log(`发布动态：${dynamicContent}`);
        
        let result = await commonPost('/fawcshop/collect-sns/v1/dynamicTopic/saveDynamicTopic', {
            "content": dynamicContent,
            "fileString": [],
            "topicId": "",
            "topicName": ""
        });
        
        if (result.code == '000000') {
            log(`发布动态成功`);
        } else {
            log(`发布动态失败，原因是：${result.msg}`);
        }
    } catch (e) {
        log(e);
    }
}

// 执行所有任务
async function runTasks() {
    // 签到任务
    log("开始签到");
    let sign = await commonPost('/fawcshop/collect-public/v1/score/addScore',{"scoreType":"2"});
    if (sign.code == '000000') {
        log(`签到成功，获得${sign.data.score}积分`);
    } else {
        log(sign.msg);
    }
    
    await sleep(config.interval);
    
    // 分享任务
    log("开始分享任务");
    let share = await commonPost('/fawcshop/collect-public/v1/score/addScore',{"scoreType":"4"});
    if (share.code == '000000') {
        if (share.data.score != null) {
            log(`分享成功，获得：${share.data.score}积分`);
        } else {
            log(`分享成功，但每周上限一次，故未获得积分`);
        }
    } else {
        log(share.msg);
    }
    
    await sleep(config.interval);
    
    // 获取文章并评论
    await getArticles();
    if (getArticlesBack) {
        log("开始评论文章");
        for (let i = 0; i < contentIdArr.length && i < 2; i++) {
            await addComment(i);
            await sleep(randomInt(3000, 6000));
        }
    }
    
    // 获取问答并回答
    await getQuestions();
    if (getQuestionsBack) {
        log("开始发布问答");
        await addQuestion();
        await sleep(randomInt(3000, 6000));
    }
    
    await getLikesQuestions();
    if (getQuestionsBack) {
        log("开始回答问题");
        for (let i = 0; i < questionIdArr.length && i < 2; i++) {
            await getLikesQuestionsComment(i);
            await sleep(randomInt(3000, 6000));
            if (getQuestionsBack) {
                await answerQuestion();
                await sleep(randomInt(3000, 6000));
            }
        }
    }
    
    // 发布动态
    await getDynamic();
    if (getDynamicBack) {
        log("开始发布动态");
        await addDynamic();
        await sleep(randomInt(3000, 6000));
    }
    
    // 点赞任务
    log("开始点赞任务");
    let getILikeThis = await commonGet(`/fawcshop/collect-sns/v1/dynamicTopic/getILikeThis?invId=31375771`);
    log(getILikeThis.msg);
    
    await sleep(config.interval);
    
    // 查询积分
    log("查询积分");
    let getUserInfo = await commonPost(`/fawcshop/mall/v1/apiCus/getUserInfo`,{"userId":aid});
    if (getUserInfo.code == '000000' && getUserInfo.data) {
        log(`拥有积分：${getUserInfo.data.scoreCount}`);
        notice += `积分：${getUserInfo.data.scoreCount}\n`;
    } else {
        log("获取积分失败");
        notice += `获取积分失败\n`;
    }
    
    // 清空数组，释放内存
    contentIdArr.length = 0;
    questionIdArr.length = 0;
}

// 主函数
async function main() {
    log('红旗智联自动化任务开始执行');
    
    // 读取Token信息
    const savedData = $prefs.valueForKey(config.tokenKey);
    if (!savedData) {
        log('未找到Token信息，请先使用Token抓取脚本获取Token');
        notify('红旗智联', '未找到Token信息，请先使用Token抓取脚本获取Token');
        $done();
        return;
    }
    
    try {
        const tokenInfo = JSON.parse(savedData);
        if (!tokenInfo.authorization || !tokenInfo.aid) {
            log('Token信息不完整，请重新获取');
            notify('红旗智联', 'Token信息不完整，请重新获取');
            $done();
            return;
        }
        
        token = tokenInfo.authorization;
        aid = tokenInfo.aid;
        
        log(`使用Token: ${token.substring(0, 15)}...`);
        log(`使用Aid: ${aid}`);
        
        // 执行任务
        await runTasks();
        
        // 发送通知
        if (notice) {
            notify('红旗智联任务完成', notice);
        }
        
        log('红旗智联自动化任务执行完成');
        $done();
    } catch (e) {
        log(`执行出错: ${e}`);
        notify('红旗智联', `执行出错: ${e}`);
        $done();
    }
}

// 执行主函数
main(); 
