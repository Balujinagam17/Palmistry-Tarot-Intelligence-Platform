from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGO_URI)

mongodb = client[settings.MONGO_DB]