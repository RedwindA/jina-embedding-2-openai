# 本项目将Jina Embedding服务请求转换为OpenAI 兼容格式

## 如何运行

### 本地运行

```bash
git clone https://github.com/RedwindA/jina-embedding-2-openai
cd jina-embedding-2-openai
pip install -r requirements.txt
python main.py
```

### Cloudflare Workers 运行

Fork 本项目，然后在 Cloudflare Workers 控制台中创建一个新的 Worker, 在Worker设置中连接Git 存储库，选择你的Fork，然后**切换到Worker分支**，其他设置保持默认即可。

任意Push一次，Cloudflare Workers 将自动部署你的Worker。或者，你也可以手动复制index.js中的代码到Cloudflare Workers编辑器中，然后部署。