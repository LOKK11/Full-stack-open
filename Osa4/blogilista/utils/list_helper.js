const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favourite = blogs.reduce(
    (prev, current) =>
      (prev.likes > current.likes)
        ? prev : current)
  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = _.countBy(blogs, 'author')
  const author = _.maxBy(Object.keys(authors), (author) => authors[author])
  return {
    author: author,
    blogs: authors[author]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authors = _.groupBy(blogs, 'author')
  const author = _.maxBy(Object.keys(authors), (author) =>
    authors[author].reduce((sum, blog) => sum + blog.likes, 0))
  return {
    author: author,
    likes: authors[author].reduce((sum, blog) => sum + blog.likes, 0)
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}