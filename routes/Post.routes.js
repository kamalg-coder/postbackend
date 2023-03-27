const express = require("express");
const { PostModel } = require("../models/post.Model");

const jwt = require("jsonwebtoken");
const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "masai", async (err, decoded) => {
      if (decoded) {
        const { userID } = decoded;
        const device = req.query.device;
        const device1 = req.query.device1;
        const device2 = req.query.device2;
        const posts = await PostModel.find({ user: userID });
        if (device1 && device2) {
          try {
            let post = await PostModel.find({ $or: [{ device: { $regex: `${device1}`, $options: "i" } }, { device: { $regex: `${device2}`, $options: "i" } }] })
            res.status(200).send(post);
          } catch (error) {
            res.status(401).send({ msg: error.message });
          }
        }
        else if (device) {
          try {
            let post = await PostModel.find({ device: { $regex: `${device}`, $options: "i" } })
            res.status(200).send(post);
          } catch (error) {
            res.status(401).send({ msg: error.message });
          }

        } else {
          res.status(200).send(posts);
        }
      }
      else {
        res.status(401).send({ msg: "User not allowed" });
      }
    });
  }
});

postRouter.get('/top', async (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "masai", async (err, decoded) => {
      if (err) res.status(401).send({ msg: "User not allowed" });
      else if (decoded) {
        const { no_if_comments } = req.body
        try {
          const posts = await PostModal.find({ no_if_comments: { $gt: no_if_comments } })
          console.log(posts)
        } catch (error) {
          res.status(401).send({ msg: "User not allowed" });
        }
      }
    })
  } else {
    res.status(401).send({ msg: "User not allowed" })
  }

})

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  const post = new PostModel(payload);
  await post.save();
  res.send({ msg: "post Created" });
});

postRouter.patch("/update/:id", async (req, res) => {
  const postID = req.params.id;
  const payload = req.body;
  try {
    await PostModel.findByIdAndUpdate({ _id: postID }, payload);
    res.send({ msg: `post with id:${postID} has been update` });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const postID = req.params.id;
  // const post = await PostModel.findOne({ _id: postID });
  try {
    await PostModel.findByIdAndDelete({ _id: postID });
    res.send({ msg: `post with id:${postID} has been deleted` });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Something went wrong" });
  }
});

module.exports = {
  postRouter,
};

