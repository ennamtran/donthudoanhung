import { GoogleGenAI, Type } from "@google/genai";

export async function analyzePetitionContent(content: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Phân tích và tóm tắt nội dung đơn thư: "${content}"`,
      config: {
        systemInstruction: "Bạn là chuyên viên tiếp dân UBND xã. Tóm tắt vụ việc dưới 30 từ và phân loại vào: 'Khiếu nại', 'Tố cáo', hoặc 'Kiến nghị, phản ánh'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            summary: { type: Type.STRING },
            urgency: { type: Type.STRING }
          },
          required: ["type", "summary", "urgency"],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis error:", error);
    return null;
  }
}

export async function searchLegalGrounds(content: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Tìm căn cứ pháp luật Việt Nam cho vụ việc: "${content}"`,
      config: {
        systemInstruction: "Bạn là chuyên gia pháp luật hành chính. Liệt kê các bộ luật liên quan.",
        tools: [{ googleSearch: {} }],
      },
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      links: chunks.map((c: any) => ({ 
        title: c.web?.title || "Văn bản luật", 
        uri: c.web?.uri || "#" 
      })).filter((l: any) => l.uri !== "#")
    };
  } catch (error) {
    console.error("Legal Search error:", error);
    return null;
  }
}

export async function generateDraftResponse(petition: any) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Soạn dự thảo công văn trả lời cho đơn thư mã ${petition.id} gửi ông/bà ${petition.petitioner.name}. Nội dung: ${petition.content}`,
      config: {
        systemInstruction: "Bạn là Chánh Văn phòng UBND xã. Soạn thảo văn bản hành chính chuẩn mực, trang trọng.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Draft generation error:", error);
    return null;
  }
}