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
  console.log('req: ', req.body);
  const obj = JSON.parse(req.body)
  const model_input = {
    prompt: obj.prompt,
    num_iterations: obj.num_iterations,
    neg_prompt: obj.neg_prompt,
    guidance_scale: obj.guidance_scale,
    width: obj.width,
    height: obj.height,
    model: obj.model,
    seed: obj.seed,
  }
  const id = Randomstring.generate({
    charset: 'hex',
    length: 10
  });
  console.log('model_input: ', model_input);
  console.log('id: ', id);
  const postData = {
    "job_id": `imagine-${id}`,
    "model_input": {
      "SD": {
        "prompt": model_input.prompt,
        "neg_prompt": model_input.neg_prompt,
        "num_iterations": model_input.num_iterations,
        "width": model_input.width,
        "height": model_input.height,
        "guidance_scale": model_input.guidance_scale,
        "seed": model_input.seed
      }
    },
    "model_type": "SD",
    "model_id": model_input.model,
    "deadline": 30,
    "priority": 1
  }
  // TODO: set BASE_URL in .env
  console.log('base url : ', process.env.BASE_URL);
  const data = await fetch(`${process.env.BASE_URL}/submit_job`, {
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