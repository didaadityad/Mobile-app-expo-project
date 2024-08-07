const { ObjectId } = require("mongodb");
const { DB } = require("../config/DB");
const {GraphQLError} = require('graphql')

class Follow {
    static async findAll(){
        const followCollection = DB.collection("follows")
        return followCollection.find().toArray()
    }

    static async findById(followId){
        const followCollection = DB.collection("follows")
        return followCollection.findOne({
            _id: new ObjectId(followId)
        })
    }

    static async create ({followingId, followerId}){
        const followCollection = DB.collection("follows")

        return followCollection.insertOne({
            followingId: new ObjectId(followingId),
            followerId: new ObjectId(followerId),
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }
    static async delete(followId) {
        const followCollection = DB.collection("follows")
        await followCollection.deleteOne({
            _id: new ObjectId(followId)
        })
    }
}

module.exports = Follow