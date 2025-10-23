import { NextRequest, NextResponse } from "next/server";
import { fallbackExtractor } from "@/lib/fallbackExtractor";
import { SkillMatrixSchema } from "@/lib/schema";
import OpenAI from "openai";

function cleanJson(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { jd } = await req.json();
    let result;

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
Extract a skill matrix from this job description. Output ONLY JSON strictly following this schema:
${JSON.stringify(SkillMatrixSchema.shape, null, 2)}

JD:
${jd}
        `;

        const resp = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        });

        let text = resp.choices[0].message?.content || "";
        text = cleanJson(text);

        try {
          result = SkillMatrixSchema.parse(JSON.parse(text));
        } catch {
          const fixPrompt = `The JSON does not match the schema. Fix it: ${text}`;
          const fixResp = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: fixPrompt }],
            temperature: 0,
          });
          const fixedText = cleanJson(fixResp.choices[0].message?.content || "{}");
          result = SkillMatrixSchema.parse(JSON.parse(fixedText));
        }
      } catch (aiError) {
        console.warn("AI extraction failed, using fallback:", aiError);
        result = fallbackExtractor(jd);
      }
    } else {
      result = fallbackExtractor(jd);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
