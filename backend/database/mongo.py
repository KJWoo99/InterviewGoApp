from pymongo import MongoClient
from config import key
from bson.json_util import dumps
from bson.json_util import loads

class MongoDB:
    def __init__(self, collection_name):
        self.client = MongoClient(key['db']['api'])
        self.database = self.client['chatbot']
        self.collection = self.database[collection_name]

    def close_connection(self):
        self.client.close()
    
    
    
    # def changeCollection(self, collection_name):
    #     self.collection = database[collection_name]
    #     return self.collection
        
    # def insert_one(self, item):
    #     self.collection.insert_one(item)

    # def insert_many(self, item):
    #     self.collection.insert_many(item)

    # def find_one(self, key, columns = None):
    #     if columns:
    #         return loads(dumps(list(self.collection.find_one(columns, key))))

    #     return loads(dumps(list(self.collection.find_one({}, key))))
    
    # def find_all(self, key, columns = None):
    #     if columns:
    #         return loads(dumps(list(self.collection.find(columns, key))))

    #     return loads(dumps(list(self.collection.find({}, key))))
    
    # def update_one(self, item, key):
    #     self.collection.update_one(item, key)

    # def delete_one(self, item, key):
    #     self.collection.delete_one(item, key)