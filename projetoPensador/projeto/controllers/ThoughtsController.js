const { compareSync } = require('bcryptjs')
const { raw } = require('mysql2')

const { Op } = require('sequelize')

const Thought = require('../models/Thought')
const User = require('../models/User')
const Like = require('../models/Like')
const session = require('express-session')
const req = require('express/lib/request')
const { status } = require('express/lib/response')

module.exports = class ThoughtsController {
  static async showThoughts(request, response) {
    let search = ''
    let order = 'DESC'

    if (request.query.search) {
      search = request.query.search
    }

    if (request.query.order == 'old') {
      order = 'ASC'
    }

    const thoughtsData = await Thought.findAll({ include: [User, Like], where: { title: { [Op.like]: `%${search}%` } }, order: [['createdAt', order]] })

    const thoughts = thoughtsData.map(data => data.get({ plain: true }))

    for (const thought of thoughts) {
      thought.likesAmount = thought.Likes.length;
      thought.likeStatus = thought.Likes.filter(like => like.userId === request.session.userId).length ? '/assets/svgs/heartFill.svg' : '/assets/svgs/heart.svg';
    };

    const thoughtsQty = thoughts.length

    try {
      return response.render('thoughts/home', { thoughts: thoughts, search: search, thoughtsQty: thoughtsQty })
    } catch (error) {
      console.error('Não foi possível acessar os dados de pensamento: ' + error)
    }
  }

  static async showDashboard(request, response) {
    // const thoughts = await Thought.findAll({ raw: true, where: { user_id: request.session.userId } })

    // return response.render('thoughts/dashboard', { thoughts: thoughts })

    const user = await User.findOne({ where: { id: request.session.userId }, include: Thought, plain: true })

    if (user.Thoughts.length == 0) {
      request.flash('message', 'Você não publicou nenhum pensamento')
      return response.render('thoughts/dashboard')
    }

    const thoughts = user.Thoughts.map((data) => data.dataValues)

    return response.render('thoughts/dashboard', { thoughts: thoughts })
  }

  static createThought(request, response) {
    return response.render('thoughts/create')
  }

  static async createThoughtSave(request, response) {
    const title = request.body.title

    if (!title || title.length == 0) {
      request.flash('message', 'Impossível publicar pesamentos vazios')

      request.session.save(() => {
        return response.redirect('/thoughts/add')
      })
    }

    try {
      await Thought.create({ title, user_id: request.session.userId })

      request.flash('message', 'Pensamento publicado')

      request.session.save(() => {
        return response.redirect('/thoughts/dashboard')
      })
    } catch (error) {
      console.error('Não foi possível registrar o pensamento, erro:' + error)
    }
  }

  static async deleteThought(request, response) {
    try {
      await Thought.destroy({ where: { id: request.params.id } })
      await Like.destroy({ where: { thoughtId: request.params.id } })
      // await Thought.update({ active: true }, { where: { id: request.params.id } })

      request.flash('message', 'Pensamento deletado')

      request.session.save(() => {
        return response.redirect('/thoughts/dashboard')
      })
    } catch (error) {
      console.error('Não foi possível deletar o pensamento, erro' + error)
    }
  }

  static async editThought(request, response) {
    try {
      const thought = await Thought.findOne({ where: { id: request.params.id }, raw: true })

      return response.render('thoughts/edit', { thought: thought })
    } catch (error) {
      console.error('Não foi possível encontrar o pensamento, erro' + error)
    }
  }

  static async editThoughtSave(request, response) {
    try {
      await Thought.update({ title: request.body.title }, { where: { id: request.params.id } })

      request.flash('message', 'Pensamento editado')

      request.session.save(() => {
        return response.redirect('/thoughts/dashboard')
      })
    } catch (error) {
      console.error('Não foi possível editar o pensamento, erro' + error)
    }
  }

  static async createLike(request, response) {
    const liked = await Like.findOne({ where: { userId: request.session.userId, thoughtId: request.params.thoughtId } }) ? true : false;

    if (!liked) Like.create({userId: request.session.userId, thoughtId: request.params.thoughtId})

    response.json({message: '"like" registrado', status: 202})
  }

  static async deleteLike(request, response) {
    const like = await Like.findOne({ where: { userId: request.session.userId, thoughtId: request.params.thoughtId } })

    if (like) Like.destroy({ where: { userId: request.session.userId, thoughtId: request.params.thoughtId } })

    response.json({message: '"like" deletado', status: 202})
  }
}
