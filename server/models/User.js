const { ObjectId } = require("mongodb");
const { DB } = require("../config/DB");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')

class User {
  static async findAll() {
    //  const pipeline = [
    //       {
    //         $lookup:
    //           /**
    //            * from: The target collection.
    //            * localField: The local join field.
    //            * foreignField: The target join field.
    //            * as: The name for the results.
    //            * pipeline: Optional pipeline to run on the foreign collection.
    //            * let: Optional variables to use in the pipeline field stages.
    //            */
    //           {
    //             from: "follows",
    //             localField: "_id",
    //             foreignField: "followingId",
    //             as: "follower",
    //           },
    //       },
    //       {
    //         $lookup:
    //           /**
    //            * from: The target collection.
    //            * localField: The local join field.
    //            * foreignField: The target join field.
    //            * as: The name for the results.
    //            * pipeline: Optional pipeline to run on the foreign collection.
    //            * let: Optional variables to use in the pipeline field stages.
    //            */
    //           {
    //             from: "follows",
    //             localField: "_id",
    //             foreignField: "followerId",
    //             as: "following",
    //           },
    //       },
    //       {
    //         $lookup:
    //           /**
    //            * from: The target collection.
    //            * localField: The local join field.
    //            * foreignField: The target join field.
    //            * as: The name for the results.
    //            * pipeline: Optional pipeline to run on the foreign collection.
    //            * let: Optional variables to use in the pipeline field stages.
    //            */
    //           {
    //             from: "users",
    //             localField: "follower.followerId",
    //             foreignField: "_id",
    //             as: "followers",
    //           },
    //       },
    //       {
    //         $lookup:
    //           /**
    //            * from: The target collection.
    //            * localField: The local join field.
    //            * foreignField: The target join field.
    //            * as: The name for the results.
    //            * pipeline: Optional pipeline to run on the foreign collection.
    //            * let: Optional variables to use in the pipeline field stages.
    //            */
    //           {
    //             from: "users",
    //             localField: "following.followingId",
    //             foreignField: "_id",
    //             as: "followings",
    //           },
    //       },
    //       {
    //         $unwind:
    //           /**
    //            * path: Path to the array field.
    //            * includeArrayIndex: Optional name for index.
    //            * preserveNullAndEmptyArrays: Optional
    //            *   toggle to unwind null and empty values.
    //            */
    //           {
    //             path: "$followers",
    //           },
    //       },
    //       {
    //         $unwind:
    //           /**
    //            * path: Path to the array field.
    //            * includeArrayIndex: Optional name for index.
    //            * preserveNullAndEmptyArrays: Optional
    //            *   toggle to unwind null and empty values.
    //            */
    //           {
    //             path: "$followings",
    //           },
    //       },
    //       {
    //         $project:
    //           /**
    //            * specifications: The fields to
    //            *   include or exclude.
    //            */
    //           {
    //             "follower": 0,
    //             "following": 0,
    //             "followers.password": 0,
    //             "followers.email": 0,
    //             "followings.password": 0,
    //             "followings.email": 0,
    //           },
    //       },
    //     ]
    const userCollection = DB.collection("users")
    const result = await userCollection.find().toArray()
    // console.log(result)
    return result
  }


  static async findById(userId) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followingId",
          as: "followersData",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "followerId",
          as: "followingsData",
        },
      },
      {
        $unwind: {
          path: "$followersData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$followingsData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followersData.followerId",
          foreignField: "_id",
          as: "followerObj",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followingsData.followingId",
          foreignField: "_id",
          as: "followingObj",
        },
      },
      {
        $unwind: {
          path: "$followerObj",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$followingObj",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          email: 1,
          password: 1,
          follower: {
            _id: "$followerObj._id",
            name: "$followerObj.name",
            username: "$followerObj.username",
          },
          following: {
            _id: "$followingObj._id",
            name: "$followingObj.name",
            username: "$followingObj.username",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          username: { $first: "$username" },
          email: { $first: "$email" },
          password: { $first: "$password" },
          followers: { $addToSet: "$follower" },
          followings: { $addToSet: "$following" },
        },
      },
    ];
    
    const userCollection = DB.collection("users");
    const result = await userCollection.aggregate(pipeline).toArray();
    // console.log(result);
    return result[0]
  }

  static async findByUsername(query) {
    const userCollection = DB.collection("users");

  const pipeline = [
    {
      $match: {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } }
        ]
      }
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followerId",
        as: "following"
      }
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "followingId",
        as: "follower"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "follower.followerId",
        foreignField: "_id",
        as: "followers"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "following.followingId",
        foreignField: "_id",
        as: "followings"
      }
    },
    {
      $project: {
        name: 1,
        username: 1,
        followers: {
          _id: 1,
          name: 1,
          username: 1
        },
        followings: {
          _id: 1,
          name: 1,
          username: 1
        }
      }
    }
  ];

  return userCollection.aggregate(pipeline).toArray()
  }

  static async create(inputUser) {
    const newUser = {
      ...inputUser,
      password: bcryptjs.hashSync(inputUser.password)
    }
    const userCollection = DB.collection("users")
    return await userCollection.insertOne(newUser)
  }

  static async login(inputLogin) {
    const userCollection = DB.collection("users")
    const user = await userCollection.findOne({
      username: inputLogin.username
    })
    // console.log(user)
    if (!user) {
      throw new GraphQLError("Invalid username / password", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }
    const isPassword = bcryptjs.compareSync(inputLogin.password, user.password)
    if (!isPassword) {
      throw new GraphQLError("Invalid username / password", {
        extensions: {
          code: "BAD_USER_INPUT"
        }
      })
    }

    const access_token = jwt.sign({
      _id: user._id,
      username: user.username
    }, 'rahasia')
    return {
      access_token
    }
  }

  static async delete(userId) {
    const userCollection = DB.collection("users")
    await userCollection.deleteOne({
      _id: new ObjectId(userId)
    })
  }

  static async update(userId, updateFields) {
    const userCollection = DB.collection("users")
    return userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updateFields,
          updatedAt: new Date()
        }
      }
    )
  }
}


module.exports = User