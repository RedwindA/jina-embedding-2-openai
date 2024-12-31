export default {
    async fetch(request, env, ctx) {
      // 如果请求路径是 /v1/embeddings，则进行拦截和转换
      const url = new URL(request.url);
      if (url.pathname === "/v1/embeddings") {
        return handleEmbeddingRequest(request, env);
      }
  
      // 如果不是 /v1/embeddings，直接按原请求返回（或根据需求处理）
      return fetch(request);
    },
  };
  
  /**
   * 处理 /v1/embeddings 请求
   */
  async function handleEmbeddingRequest(request, env) {
    try {
      // 1. 解析原始请求体
      const originalBody = await request.json();
  
      // 2. 根据 .env 中的环境变量，组装新的请求体
      //    说明：
      //      - input: 保留原始 "input"
      //      - model: 默认使用 env.MODEL（如未设置则可填 jina-embeddings-v3）
      //      - task: 默认使用 env.TASK（可选值见文档），例如 retrieval.query
      //      - late_chunking: 根据 env.LATE_CHUNKING 判断 true/false
      //      - dimensions: 根据 env.DIMENSIONS 或默认 1024
      //      - embedding_type: 与原来 encoding_format 对应，如 "float" 等
      const transformedBody = {
        model: env.MODEL || "jina-embeddings-v3",
        task: env.TASK || "retrieval.query",
        // late_chunking: env.LATE_CHUNKING === "true",
        dimensions: env.DIMENSIONS ? parseInt(env.DIMENSIONS, 10) : 1024,
        embedding_type: originalBody.encoding_format || "float",
        input: originalBody.input,
      };
  
      // 3. 处理 Authorization（如果配置了 JINA_API_KEY，则使用覆盖；否则沿用原请求中的 Bearer）
      const originalAuthorization = request.headers.get("Authorization") || "";
      let finalToken = "";
      if (env.JINA_API_KEY && env.JINA_API_KEY.trim() !== "") {
        finalToken = env.JINA_API_KEY.trim(); // 优先使用 env.JINA_API_KEY
      } else {
        // 如果没有设置 JINA_API_KEY，就把原有的 "Bearer xxxxx" 中 xxxxx 提取出来
        finalToken = originalAuthorization.replace(/^Bearer\s+/i, "").trim();
      }
  
      // 若没有特别配置，则默认 JINA_API_BASE_URL 为 https://api.jina.ai/v1
      const jinaApiBase = env.JINA_API_BASE_URL || "https://api.jina.ai/v1";
  
      // 4. 将转换后的请求体发给 Jina Embeddings API
      const jinaResponse = await fetch(`${jinaApiBase}/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: finalToken ? `Bearer ${finalToken}` : "",
        },
        body: JSON.stringify(transformedBody),
      });
  
      // 5. 直接把 Jina 的响应返回给客户端
      return jinaResponse;
    } catch (error) {
      // 若出现异常，则返回 500
      return new Response(
        JSON.stringify({ error: error.message || "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }