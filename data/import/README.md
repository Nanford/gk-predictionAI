# 广东高考公开数据导入目录

`universities.csv` 由 `scripts/convert-universities-xls.ps1` 从项目根目录旧版高校名单生成。

正式录取数据进入系统前必须满足：

- 来源为省教育考试院或高校招生网公开页面；
- CSV 中保存来源网址、年份和更新时间；
- 导入后经过人工核验，将审核状态改为 `verified`；
- 未核验记录不得参与生产环境预测；
- 开发样例必须使用 `is_demo=true`，不得冒充公开历史数据。

预留模板：

- `score-rank-segments.template.csv`
- `admission-history.template.csv`

## 广东省教育考试院官方入口

- 2025 年本科批次正式投档：https://eea.gd.gov.cn/ptgk/content/post_4746781.html
- 2024 年本科批次正式投档：https://eea.gd.gov.cn/gkmlpt/content/4/4458/post_4458330.html?jump=true
- 2023 年本科批次正式投档：https://eea.gd.gov.cn/zwgk/sjfb/tjsj/content/post_4221649.html
- 2025 年普通高考成绩各分数段数据：https://eea.gd.gov.cn/ptgk/content/post_4734345.html

附件内容整理为 CSV 后，先以 `verification=draft` 导入并复核；确认列映射、院校代码、专业组代码、最低分和最低排位无误后，再将审核状态调整为 `verified`。
