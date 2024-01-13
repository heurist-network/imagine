const { setGlobalDispatcher, ProxyAgent } = require("undici");

const detectEnvAndSetUrl = () => {
  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev) return
  const dispatcher = new ProxyAgent({ uri: new URL('http://127.0.0.1:7890').toString() });
  setGlobalDispatcher(dispatcher);
}
detectEnvAndSetUrl()

export default async function handler(req, res) {
  console.log('req: ', req.body);
  console.log('typeof req: ', typeof JSON.parse(req.body));
  const obj = JSON.parse(req.body)
  const model_input = {
    prompt: obj.prompt,
    num_iterations: obj.num_iterations,
    neg_prompt: obj.neg_prompt
  }
  const postData = {
    "job_id": "job1000",
    "model_input": {
      "SD": {
        "prompt": model_input.prompt,
        "neg_prompt": "anime, bad hands, low quality, logo, artist name, distorted limbo, incorrect hands, incorrect arms",
        "num_iterations": model_input.num_iterations,
        "width": 512,
        "height": 512
      }
    },
    "model_type": "SD",
    "model_id": "BlazingDrive",
    "deadline": 60,
    "priority": 1
  }
  const data = await fetch('http://70.23.102.189:3030/submit_job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  }).then((res) => {
    const url = res.text()
    return url
  })
  console.log('data---', data);
  const dataUrl = data.replaceAll('"', '')
  res.status(200).json({ data: dataUrl, status: 200, message: 'ok' })
}