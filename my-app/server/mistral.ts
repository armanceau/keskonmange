type MistralMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type MistralResponse = {
  choices?: { message?: { content?: string } }[];
};

const DEFAULT_MODEL = process.env.MISTRAL_MODEL ?? "mistral-tiny";

export async function callMistral(
  apiKey: string,
  messages: MistralMessage[],
): Promise<string> {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mistral error ${response.status}: ${detail}`);
  }

  const data = (await response.json()) as MistralResponse;
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Empty Mistral response");
  }

  return content;
}
