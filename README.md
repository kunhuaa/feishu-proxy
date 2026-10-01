# 飞书 Webhook 代理服务器

一个轻量级的 Node.js 服务，用于将 Discord 格式的 webhook 消息转换为飞书格式。

## 背景

微软积分等工具默认发送 Discord embed 格式的通知，但飞书机器人只支持自己的格式。
这个代理服务可以在中间转换格式，无需修改原工具。

## 功能特点

- 🔄 Discord embed → 飞书 text 格式转换
- 🐳 Docker 一键部署
- ⚡ 轻量级，资源占用低
- 🔒 支持 CORS（可选）

## 快速开始

### Docker 部署（推荐）

```bash
# 构建镜像
docker build -t feishu-proxy .

# 运行容器
docker run -d \
  --name feishu-proxy \
  --restart unless-stopped \
  -p 9000:9000 \
  feishu-proxy
```

### 本地运行

```bash
# 安装依赖
npm install

# 运行
node server.js
```

## API 说明

### 发送消息

```http
POST http://your-server:9000/
Content-Type: application/json

{
  "embeds": [
    {
      "title": "通知标题",
      "description": "通知内容",
      "fields": [
        {"name": "字段1", "value": "值1"}
      ]
    }
  ]
}
```

### 直接发送文本

```http
POST http://your-server:9000/
Content-Type: application/json

{
  "content": "纯文本消息"
}
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 监听端口 | 9000 |
| `FEISHU_WEBHOOK` | 飞书 Webhook 地址 | 需在代码中配置 |

## 使用场景

1. **微软积分通知** - 将微软积分的 Discord embed 转换为飞书消息
2. **其他工具集成** - 任何支持 webhook 的工具都可以对接飞书

## 文件结构

```
feishu-proxy/
├── server.js      # 主服务代码
├── Dockerfile     # Docker 构建文件
├── package.json   # 依赖配置
└── README.md      # 说明文档
```

## 许可证

MIT License
