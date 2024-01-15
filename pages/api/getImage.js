import Randomstring from "randomstring";
const { setGlobalDispatcher, ProxyAgent } = require("undici");
const detectEnvAndSetUrl = () => {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) return
  const dispatcher = new ProxyAgent({ uri: new URL('http://127.0.0.1:7890').toString() });
  setGlobalDispatcher(dispatcher);
}
detectEnvAndSetUrl()

export default async function handler(req, res) {
  const obj = JSON.parse(req.body)
  // only include the fields that are needed
  const model_input = {
    prompt: obj.prompt,
  }
  if (obj.num_iterations) {
    model_input.num_iterations = obj.num_iterations
  }
  if (obj.neg_prompt) {
    model_input.neg_prompt = obj.neg_prompt
  }
  if (obj.guidance_scale) {
    model_input.guidance_scale = obj.guidance_scale
  }
  if (obj.width) {
    model_input.width = obj.width
  }
  if (obj.height) {
    model_input.height = obj.height
  }
  if (obj.seed !== undefined) {
    model_input.seed = obj.seed
  }
  const id = Randomstring.generate({
    charset: 'hex',
    length: 10
  });
  const postData = {
    "job_id": `imagine-${id}`,
    "model_input": {
      "SD": model_input
    },
    "model_type": "SD",
    "model_id": obj.model,
    "deadline": 30,
    "priority": 1
  }
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/submit_job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  }).then((res) => {
    const url = res.text()
    return url
  })
  const dataUrl = data.replaceAll('"', '')
  res.status(200).json({ data: dataUrl, status: 200, message: 'ok' })
}