const http = require('http');

const FEISHU_WEBHOOK = 'https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_HOOK_ID';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        let feishuContent = '';
        
        if (data.content) {
          feishuContent = data.content;
        } else if (data.embeds && data.embeds[0]) {
          const embed = data.embeds[0];
          let lines = [];
          if (embed.title) lines.push(`**${embed.title}**`);
          if (embed.description) lines.push(embed.description);
          if (embed.fields) {
            for (const field of embed.fields) {
              lines.push(`**${field.name}**\n${field.value}`);
            }
          }
          feishuContent = lines.join('\n\n');
        }
        
        const feishuPayload = {
          msg_type: 'text',
          content: { text: feishuContent }
        };
        
        const postData = JSON.stringify(feishuPayload);
        const options = {
          hostname: new URL(FEISHU_WEBHOOK).hostname,
          path: new URL(FEISHU_WEBHOOK).pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        const feishuReq = http.request(options, (feishuRes) => {
          let feishuBody = '';
          feishuRes.on('data', chunk => { feishuBody += chunk; });
          feishuRes.on('end', () => {
            res.writeHead(feishuRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, feishuResponse: feishuBody }));
          });
        });
        
        feishuReq.on('error', (e) => {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        });
        
        feishuReq.write(postData);
        feishuReq.end();
        
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(9000, () => {
  console.log('Feishu webhook proxy running on port 9000');
});
