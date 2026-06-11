# 利盛智能客户中枢 · 客户分析 Agent 系统（概念验证版）

面向餐饮设备出口业务的 AI 客户数据中台与智能分析系统产品原型。模拟数据演示，用于需求确认与方案评审。

## 页面

| 路由 | 页面 | 对应需求模块 |
| --- | --- | --- |
| `/#/dashboard` | 经营仪表盘 | 管理后台首页（模块 6 统计 + 国家分布 + 销售排行） |
| `/#/customers` | 客户知识库 | 模块 2 客户档案 + 模块 5 标签 + 模块 6 分类统计 |
| `/#/customers/:id` | 客户详情 | 聊天记录 + 模块 3 AI 画像 + 模块 4 评分明细 + 跟进记录 |
| `/#/sales` | 销售跟进监控 | 模块 7 销售监控 + 漏斗 + AI 任务队列 + 风险预警 |
| `/#/ai` | AI 分析中心 | 评分模型规则 + 标签体系 + 分析管线 + 任务留痕 |
| `/#/integrations` | 数据接入中心 | 模块 1 WhatsApp 同步 + 多渠道接入 + 安全合规 |

## 本地运行

```bash
npm install
npm run dev        # 开发
npm run build      # 构建
npm run preview -- --port 4399   # 预览构建产物
```

## 部署（Vercel）

```bash
npm i -g vercel
vercel --prod      # 构建产物目录 dist，框架选 Vite
```

建议演示域名：`lisheng-agent-demo.vercel.app`（与现有 lisheng-crm-system 保持命名一致）。

## 技术栈

React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router + Recharts + Lucide Icons
