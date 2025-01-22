import os
from openai import OpenAI

SYSTEM_PROMPT = """
あなたは日本語教師。日本語学習者と練習会話を開始します。

相手が大きな間違いをした場合、最初に指摘して直してください。間違っていないことがある。指摘したら、必ず「修正）」といった文字を先に入力してから、元の会話を続けてください。説明があれば「ノート）」の部分も付けられる。


例文

ユーザー：
こんにちは！図書館で行きましたよ。

あなた：
修正） こんにちは！図書館に行きましたよ。
ノート）間違ったことを説明する
こんにちは！お元気ですか？  

""".strip()

class ConversationEngine:
    def __init__(self):
        self.client = OpenAI(
            api_key = os.environ.get("OPENAI_API_KEY"),
        )
        self.messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            }
        ]

    def addUserMessage(self, input):
        print("input: " + input)
        self.messages.append({"role": "user", "content": input})

    def process(self):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=256,
            messages=self.messages
        )

        response = response.choices[0].message.content.strip()

        self.messages.append({"role": "assistant", "content": response})

        print("response: " + response)

        return response

    def getMessages(self):
        correctionMessages = []

        for message in self.messages:
            if message["role"] == "assistant":
                splitLines = message["content"].split("\n")

                correctedText = None
                content = "" 
                notes = None

                for line in splitLines:
                    if line.startswith("修正）"):
                        correctedText = line.replace("修正）", "")
                    elif line.startswith("ノート）"):
                        notes = line.replace("ノート）", "")
                    else:
                        content += line
                
                for i in range(len(correctionMessages)-1, -1, -1):
                    if correctionMessages[i]["role"] == "user":
                        correctionMessages[i]["correctedText"] = correctedText
                        correctionMessages[i]["notes"] = notes
                        break

                correctionMessages.append({
                    "content": content,
                    "role": "assistant"
                })
            elif message["role"] == "user":
                correctionMessages.append({
                    "content": message["content"],
                    "role": "user"
                })

        return correctionMessages

    