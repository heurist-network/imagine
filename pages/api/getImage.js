import Randomstring from "randomstring";

export default async function handler(req, res) {

  try {
    const obj = JSON.parse(req.body)
    // only include the fields that are needed
    const model_input = {
      prompt: obj.prompt || "",
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
    if (obj.seed) {
      let seed = parseInt(obj.seed);
      if (seed > Number.MAX_SAFE_INTEGER) {
        seed = seed % Number.MAX_SAFE_INTEGER;
      }
      model_input.seed = seed;
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

    //console.log(postData)
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/submit_job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.AUTH_KEY}`},
      body: JSON.stringify(postData)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const url = await response.text();
    const dataUrl = url.replaceAll('"', '');
    res.status(200).json({ data: dataUrl, status: 200, message: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: error.message });
  }
}