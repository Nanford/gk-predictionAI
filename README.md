# 高考志愿 AI 预测辅助参考系统

本项目包含可运行的 UniApp 跨端前端、Fastify API、MySQL 数据库结构和公开数据导入工具。预测概率由可审计的统计规则计算，DeepSeek 仅用于生成解释文本。

## 本地运行

### 1. 初始化数据库

MySQL 8 启动后，在 `server/` 中创建本地 `.env`，参考 `.env.example` 填写 root 密码和运行账号密码。随后执行：

```powershell
cd server
npm install
npm run db:bootstrap
npm run db:generate
npm run db:migrate
npm run import:universities -- ..\data\import\universities.csv
npm run seed:demo
```

`db:bootstrap` 使用 root 创建 `gaokao_ai` 和最小权限运行账号 `gaokao_app`。API 运行期间只使用 `gaokao_app`。

### 2. 启动后端

```powershell
cd server
npm run dev
```

API 默认监听 `http://127.0.0.1:3000`。

### 3. 启动 UniApp H5

```powershell
cd frontend\uniapp
npm install
npm run dev:h5
```

H5 默认监听 `http://127.0.0.1:5174`。App 资源构建命令：

```powershell
npm run build:app
```

## 数据边界

- `高校代码.xls` 通过 `scripts/convert-universities-xls.ps1` 转换为 UTF-8 CSV。
- `data/import/` 提供一分一段表和录取历史 CSV 模板。
- 正式公开数据必须保存来源网址并经过 `verified` 审核后才能参与生产预测。
- `npm run seed:demo` 生成广东六校开发验证样例，记录带有 `is_demo=true`，不能冒充正式公开数据。
- 2026 年一分一段表未导入前，用户必须手工填写全省位次，系统不会使用 2025 年数据强行估算。

## AI 配置

在 `server/.env` 中填写：

```text
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-pro
```

未填写 Key 或 DeepSeek 调用异常时，系统返回规则模板解释且不扣 AI 使用额度。预测结果仅供辅助参考，不代表最终录取结果。
# gk-predictionAI
