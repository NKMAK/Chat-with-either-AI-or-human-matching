import openai

openai.api_key = ""

def bot_response_text(prompt):

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは会話している人の友達です。自然な会話になるのであれば質問を返してください。"},
            {"role": "user", "content": prompt+"。以下の文に対して返答はしないでください、あなたの返答はすべてひらがなで返して漢字は使わないでくださいください"}
        ],
        max_tokens=150
    )
    print(response["choices"][0]["message"]["content"])

    # 生成されたテキストを返す
    return response["choices"][0]["message"]["content"]