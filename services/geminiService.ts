
import { GoogleGenAI, Type } from "@google/genai";
import { Player, MatchSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getMatchSuggestions = async (players: Player[]): Promise<MatchSuggestion | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analise estes jogadores de Padel e sugira um jogo equilibrado (2 contra 2). 
            Jogadores disponíveis: ${JSON.stringify(players)}. 
            IMPORTANTE: O sistema de nível é de 1 a 6, onde 1 é o melhor nível (Elite/Pro) e 6 é Iniciante. 
            Considere o nível técnico e o lado preferido (Drive/Revés) para maximizar o equilíbrio das equipas.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        team1Ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                        team2Ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                        reasoning: { type: Type.STRING },
                        balanceScore: { type: Type.NUMBER }
                    },
                    required: ["team1Ids", "team2Ids", "reasoning", "balanceScore"]
                }
            }
        });

        const data = JSON.parse(response.text);
        
        const team1 = players.filter(p => data.team1Ids.includes(p.id));
        const team2 = players.filter(p => data.team2Ids.includes(p.id));

        return {
            team1,
            team2,
            reasoning: data.reasoning,
            balanceScore: data.balanceScore
        };
    } catch (error) {
        console.error("Error generating match suggestion:", error);
        return null;
    }
};
