const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')

describe('Api tests for blogs', () => {
  let token
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    await User.insertMany(helper.users)
    await Blog.insertMany(helper.blogs)

    token = await createAndLoginUser()
  })

  test('login with valid credentials', async () => {
    const { ...newUser } = helper.newUser
    delete newUser.name
    const response = await api
      .post('/api/login')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .expect(200)

    token = response.body.token
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 6)
  })

  test('identifier is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
  })

  test('a valid blog can be added', async () => {
    const newBlog = helper.newBlog

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map(r => r.title)

    assert.strictEqual(blogsAtEnd.length, helper.blogs.length + 1)

    assert(contents.includes('New Blog'))
  })

  test('likes default to 0', async () => {
    const { ...newBlog } = helper.newBlog
    delete newBlog.likes

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === 'New Blog')

    assert.strictEqual(addedBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const { ...newBlog } = helper.newBlog
    delete newBlog.title

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
  })

  test('blog without url is not added', async () => {
    const { ...newBlog } = helper.newBlog
    delete newBlog.url

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
  })

  test('blog can be deleted', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.newBlog)
      .expect(201)

    const blogToDelete = response.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)

    const contents = blogsAtEnd.map(r => r.title)

    assert(!contents.includes(blogToDelete.title))
  })

  test('blog can be updated', async () => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]

    const updatedBlog = { ...blogToUpdate, likes: 100 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlogAtEnd.likes, 100)
  })

  test('unauthorized user cannot post a blog', async () => {
    const newBlog = helper.newBlog

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length)
  })
})

describe('Api tests for users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    await User.insertMany(helper.users)
    await Blog.insertMany(helper.blogs)
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Valid user can be added', async () => {
    const newUser = helper.newUser

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const usernames = usersAtEnd.map(r => r.username)

    assert.strictEqual(usersAtEnd.length, helper.users.length + 1)

    assert(usernames.includes('newUser'))
  })

  after(() => {
    mongoose.connection.close()
  })

  test('user without username is not added', async () => {
    const { ...newUser } = helper.newUser
    delete newUser.username

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('`username` is required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.users.length)
  })

  test('user without password is not added', async () => {
    const { ...newUser } = helper.newUser
    delete newUser.password

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.users.length)
  })
})



const createAndLoginUser = async () => {
  const { ...newUser } = helper.newUser
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  delete newUser.name
  const response = await api
    .post('/api/login')
    .set('Content-Type', 'application/json')
    .send(newUser)
    .expect(200)

  return response.body.token
}