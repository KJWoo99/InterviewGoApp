from openai import OpenAI
from config import key
import json

class chatgpt:
    def __init__(self) -> None:
        self.client = OpenAI(
        api_key = key['openai']['api']
    )
    
    # 추가 질문 생성 메소드
    def get_openai_response(self, question, user_answer, position):
        response = self.client.chat.completions.create(
            model="ft:gpt-3.5-turbo-0125:personal::9etSf6Sw",
            messages=[{"role": "system", "content": "You are an employee who makes questions for job interviews in Korea. Interview job topic: [Content], Interview question: [Content], Answer: If you come in the form of [Content], you can create one additional question through the content of the interview question and the answer based on the job topic."}, {"role": "user", "content": f"면접 직무 주제: {position}, 면접 질문: {question}. 답변: {user_answer}"}],
            temperature=0.7,
            stop=None
        )
        return response.choices[0].message.content.strip()
    

    # summary 메소드
    def get_openai_summary_response(self, interview_logs):
        response = self.client.chat.completions.create(
            model="ft:gpt-3.5-turbo-0125:personal::9fRh9uaE",
            messages=[{"role": "system", "content": """You are the interviewer from now on. Based on the interview process, deliver the interview's overall evaluation to the interviewee. You should explain it with the keyword 'applicant' to the person you are delivering. After analyzing all of the formats {"quest" : [contents], "answer": [contents], and "position": [contents]} given as the contents of the interview process, give an overall summary of the interview. The criteria for issuing the summary are as follows. Everything is contained in a key called summary, and all contents, including the summary key, are made into JSON-type strings. Only make results.
            1. Score: [Content] To quantify how many interviews were based on 100 points in the content part.
            1-1. The criteria for quantification are the contents of the answer (evaluated as strength and weakness), the structure of the answer, the delivery power and speech method, and the actual experience and examples.
            2. Each content of strengths, weaknesses, delivery, and total can be expressed up to 300 characters based on Korean.
            2-1. Strengths: Write only one content to give strength feedback to the [Content] part in the [Content] format.
            2-2. Weaknesses: Write only one piece of weakness feedback in the [Content] part in the [Content] format.
            2-3. Delivery: Write only 1 feedback on answer's overall speech in the [Content] part in the [Content] format.
            3. Write only one content for the total evaluation, which is the sum of strengths, weaknesses, and delivery, in the form of total: [content]."""}, {"role": "user", "content": f"{interview_logs}"}],
            temperature=0.7,
            stop=None
        )

        try:
            answer = json.loads(response.choices[0].message.content.strip())['summary']
        except:
            answer = None

        return answer