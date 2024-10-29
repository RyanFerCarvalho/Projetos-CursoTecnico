const { request } = require("express")
const Thought = require('../models/Thought')

module.exports = {
  checkAuth (request, response, next) {
    if(!request.session.userId) {
      return response.redirect('/login')
    }

    next()
  },

  async thoughtPermission (request, response, next) {
    if (!await Thought.findOne({ where: { id: request.params.id, user_id: request.session.userId }})) {
        return response.redirect('/login')
    }

    next()
  }

}
