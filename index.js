import express from 'express'
import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.post('/generate', async (req, res) =>{

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    userAgent: 'https://www.npmjs.com/package/create-replicate'
  });

  const model = 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc'
  
  const input = {
    width: 768,
    height: 768,
    prompt: 'An astronaut driving a red car, cinematic, dramatic',
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


app.listen(3000, () => {
  console.log('Server running on port 3000')
})



