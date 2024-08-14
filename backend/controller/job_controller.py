from data.job_data import Datago, Saramin

class jobController:
    def __init__(self):
        self.datago = Datago()
        self.saramin = Saramin()

    def objectIdToStr(self, documents):
        for doc in documents:
            doc['_id'] = str(doc['_id'])  # ObjectId를 문자열로 변환
        return documents

    def getJobData(self):
        datago_documents = self.datago.SampleData()
        saramin_documents = self.saramin.SampleData()

        serialized_data = {
            "datago": self.objectIdToStr(datago_documents),
            "saramin": self.objectIdToStr(saramin_documents)
        }

        return serialized_data