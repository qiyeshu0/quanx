   const $ = new Env('红旗智联Token');
   
   function main() {
       console.log('[红旗智联Token] 脚本开始执行');
       console.log('[红旗智联Token] 响应数据:', $response.body);
       
       try {
           const body = JSON.parse($response.body);
           console.log('[红旗智联Token] 解析后的数据:', body);
           
           if (body.code === '000000' && body.data) {
               const token = body.data.token;
               const aid = body.data.aid;
               
               if (token && aid) {
                   console.log('[红旗智联Token] 找到Token和Aid');
                   console.log('[红旗智联Token] Token:', token.substring(0, 15) + '...');
                   console.log('[红旗智联Token] Aid:', aid);
                   
                   // 保存Token信息
                   const tokenInfo = {
                       authorization: token,
                       aid: aid,
                       updateTime: new Date().toLocaleString()
                   };
                   
                   $prefs.setValueForKey(JSON.stringify(tokenInfo), 'hqzl_token');
                   console.log('[红旗智联Token] Token已保存');
                   
                   $.msg('红旗智联', 'Token获取成功', `Token已保存，可以使用自动化脚本了`);
               }
           }
       } catch (e) {
           console.log('[红旗智联Token] 发生错误:', e);
           $.msg('红旗智联', 'Token获取失败', `错误: ${e}`);
       }
       
       return $response.body;
   }
   
   main();
   $done({body: $response.body});
