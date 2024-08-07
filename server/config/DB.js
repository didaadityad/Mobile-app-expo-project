const {MongoClient} = require("mongodb")

const MONGODB_URI = "mongodb+srv://dddtydrmwn:Didatama123.@cluster0.p2kh6c1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(MONGODB_URI)

const DB = client.db("DB_CH1")

module.exports = {
    client,
    DB
}