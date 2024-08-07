const {MongoClient, ObjectId} = require("mongodb")

const MONGODB_URI = "mongodb+srv://dddtydrmwn:Didatama123.@cluster0.p2kh6c1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(MONGODB_URI)



async function run(){
    try {
        const database = client.db("DB_CH1")
        const postCollection = database.collection("Post")
        // const Comments = [
        //     {
        //         content: `Jangan di cobain`,
        //         username: `SayutiMelik`,
        //         createdAt: new Date(),
        //         updatedAt: new Date()
        //     }
        // ]

        // const Likes = [
        //     {
        //         username: `SayutiMelik`,
        //         createdAt: new Date(),
        //         updatedAt: new Date()
        //     },
        //     {
        //         username: `SeikuroSaga`,
        //         createdAt: new Date(),
        //         updatedAt: new Date()
        //     }
        // ]
        const doc = {
            content: `ini cuma nyoba kan`,
            tags: ["Trial"],
            author: 1,
            comments: [
                {
                    content: `Jangan di cobain`,
                    username: `SayutiMelik`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            likes: [
                {
                    username: `SayutiMelik`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: `SeikuroSaga`,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        // const result = await postCollection.updateOne({
        //     _id: new ObjectId('66a07e351fc1714f180971ca')

        // },{
        //     $push: {
        //         tags: "Nyoba aja"
        //     }
        // })
// INI UPDATE

        const result = await postCollection.find().toArray()
        // INI FIND ALL

        // const result = await postCollection.insertOne(doc)
        // INI CREATE

        // const result = await postCollection.findOne({
        //     _id: new ObjectId(`66a07bb245922b2eab8e9d57`)
        // })
        // INI FIND 1

        console.log(result)

    } catch (error) {
        
    }
}

run().catch(console.dir)

// module.exports= {
//     client,
//     database
// }