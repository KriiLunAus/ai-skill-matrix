import OpenAI from "openai";
import { SkillMatrixSchema } from "./schema";

export async function callAIAdapter(jd: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `
You are a structured extractor. Output only valid JSON matching this schema:
${SkillMatrixSchema.toString()}

Job description:
${jd}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const raw = completion.choices[0].message?.content?.trim() ?? "{}";
  try {
    return JSON.parse(raw);
  } catch {
    const fixPrompt = `
Fix this JSON to match the schema strictly. Output ONLY JSON.

Broken JSON:
${raw}
`;
    const retry = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: fixPrompt }],
      temperature: 0,
    });
    return JSON.parse(retry.choices[0].message?.content ?? "{}");
  }
}
