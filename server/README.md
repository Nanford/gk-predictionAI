# API 服务

## 常用命令

```powershell
npm run db:bootstrap
npm run db:generate
npm run db:migrate
npm run import:universities -- ..\data\import\universities.csv
npm run import:score-rank -- ..\data\import\score-rank-segments.csv
npm run import:admission-history -- ..\data\import\admission-history.csv
npm run seed:demo
npm test
npm run build
npm run dev
```

正式环境设置 `NODE_ENV=production` 后：

- 开发模拟充值接口不会注册；
- `is_demo=true` 的开发样例不会参与预测；
- 只有 `verification=verified` 的公开数据参与预测。
