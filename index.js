import express from 'express'
import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
});

app.post('/generate', async (req, res) =>{
  const { prompt } = req.body;

  if(!prompt){
    return res.status(400).json({ error: 'El campo "prompt" es obligatorio en la solicitud.' });
  }

  const model = 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc'
  
  const input = {
    width: 768,
    height: 768,
    prompt,
    refine: 'expert_ensemble_refiner',
    scheduler: 'K_EULER',
    lora_scale: 0.6,
    num_outputs: 2,
    guidance_scale: 7.5,
    apply_watermark: false,
    high_noise_frac: 0.8,
    negative_prompt: '',
    prompt_strength: 0.8,
    num_inference_steps: 25,
  };

  console.log('Running...')
  const output = await replicate.run(model, { input })
  console.log('Done!', output)
  
  res.send('Generando')
});

app.post('/chat', async (req, res) => {

  const { prompt } = req.body;

  const input = {
    top_k: 0,
    top_p: 0.9,
    prompt,
    max_tokens: 512,
    min_tokens: 0,
    temperature: 0.6,
    system_prompt: "You are a helpful assistant",
    length_penalty: 1,
    stop_sequences: "<|end_of_text|>,<|eot_id|>",
    prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 1.15,
    log_performance_metrics: false
  };
  
  for await (const event of replicate.stream("meta/meta-llama-3-70b-instruct", { input })) {
    process.stdout.write(event.toString());
  };
  res.end()


})


app.listen(3000, () => {
  console.log('Server running on port 3000')
})



