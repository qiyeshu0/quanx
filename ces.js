   const $ = new Env('红旗智联Token');
   
   function main() {
       try {
           const body = JSON.parse($response.body);
           console.log(`[红旗智联Token] 响应数据: ${JSON.stringify(body)}`);
           
           if (body.code === '000000' && body.data) {
               const token = body.data.token;
               const aid = body.data.aid;
               
               if (token && aid) {
                   // 保存Token信息
                   const tokenInfo = {
                       authorization: token,
                       aid: aid,
                       updateTime: new Date().toLocaleString()
                   };
                   
                   $prefs.setValueForKey(JSON.stringify(tokenInfo), 'hqzl_token');
                   
                   console.log(`[红旗智联Token] Token保存成功: ${token.substring(0, 15)}...`);
                   console.log(`[红旗智联Token] Aid保存成功: ${aid}`);
                   
                   $.msg('红旗智联', 'Token获取成功', `Token已保存，可以使用自动化脚本了`);
               }
           }
       } catch (e) {
           console.log(`[红旗智联Token] 错误: ${e}`);
           $.msg('红旗智联', 'Token获取失败', `错误: ${e}`);
       }
       
       return $response.body;
   }
   
   main();
   $done({body: $response.body});
