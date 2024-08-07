const { ObjectId } = require("mongodb");
const { DB } = require("../config/DB");

class Post {
    static async findAll() {
        const pipeline = [
            {
                $lookup:
                /**
                 * from: The target collection.
                 * localField: The local join field.
                 * foreignField: The target join field.
                 * as: The name for the results.
                 * pipeline: Optional pipeline to run on the foreign collection.
                 * let: Optional variables to use in the pipeline field stages.
                 */
                {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind:
                /**
                 * path: Path to the array field.
                 * includeArrayIndex: Optional name for index.
                 * preserveNullAndEmptyArrays: Optional
                 *   toggle to unwind null and empty values.
                 */
                {
                    path: "$author",
                },
            },
            {
                $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                    "author.password": 0,
                    "author.email": 0,
                },
            },
        ]


        const postCollection = DB.collection("posts")
        const result = await postCollection.aggregate(pipeline).toArray()
        console.log(result)
        return result
    }

    static async findById(postId) {
        const pipeline =[
            {
              $match:
                {
                  _id: new ObjectId(postId),
                },
            },
            {
              $lookup:
                {
                  from: "users",
                  localField: "authorId",
                  foreignField: "_id",
                  as: "author",
                },
            },
            {
              $unwind:
                {
                  path: "$author",
                },
            },
            {
              $project:
                {
                  "author.password": 0,
                  "author.email": 0,
                },
            },
          ]
        const postCollection = DB.collection("posts")
        const result = await postCollection.aggregate(pipeline).toArray()
        // const result = await postCollection.findOne({
        //     _id: new ObjectId(postId)
        // })
        console.log(result)
        return result[0]

    }

    static async create({ content, tags, imgUrl, authorId, comments, likes }) {
        const postCollection = DB.collection("posts")
        return postCollection.insertOne({
            content,
            tags,
            imgUrl,
            authorId,
            comments: comments || [],
            likes: likes || [],
            createdAt: new Date(),
            updatedAt: new Date()

        })
    }

    static async delete(postId) {
        const postCollection = DB.collection("posts")
        await postCollection.deleteOne({
            _id: new ObjectId(postId)
        })
    }

    static async update(postId, updateFields) {
        const postCollection = DB.collection("posts")
        return postCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $set: {
                    ...updateFields,
                    updatedAt: new Date()
                }
            }
        )
    }
}


module.exports = Post