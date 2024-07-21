import os
from openai import OpenAI

class ConversationEngine:
    def __init__(self):
        self.client = OpenAI(
            api_key = os.environ.get("OPENAI_API_KEY"),
        )
        self.messages = [
            {
                "role": "system",
                "content": "日本語だけを使ってください。あなたは日本語教師です。日本語学習者と練習会話を開始します。"
            }
        ]

    def addUserMessage(self, input):
        self.messages.append({"role": "user", "content": input})

    def process(self):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=256,
            messages=self.messages
        )

        response = response.choices[0].message.content.strip()

        self.messages.append({"role": "assistant", "content": response})

        return response
    