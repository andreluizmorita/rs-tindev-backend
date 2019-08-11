const axios = require('axios')
const Dev = require('../models/DevModel')

module.exports = {
  
  async index(req, res) {
    const { user } = req.headers

    const loggedDev = await Dev.findById(user)

    if(!loggedDev) {
      return res.status(400).json({ error: 'Dev not exists' })
    }

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes }},
        { _id: { $nin: loggedDev.dislikes }},
      ]
    });

    return res.json(users)
  },
  
  async store(req, res) {
    const { username } = req.body

    const  response = await axios.get(`https://api.github.com/users/${username}`)

    const { name, bio, avatar_url: avatar } = response.data

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    })

    return res.send(dev)
  }
}