from database.mongo import MongoDB

class Datago(MongoDB):
    def __init__(self) -> None:
        super().__init__('datago')

    def SampleData(self):
        return list(self.collection.aggregate([{"$sample": {"size": 5}}]))


class Saramin(MongoDB):
    def __init__(self) -> None:
        super().__init__('saramin')

    def SampleData(self):
        return list(self.collection.aggregate([{"$sample": {"size": 5}}]))