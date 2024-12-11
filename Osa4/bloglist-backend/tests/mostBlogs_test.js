const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('most blogs', () => {
  test('when list has only one blog return the author of that', () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog)
    assert.deepStrictEqual(result,
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
    )
  })

  test('when list has no blogs return null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs return the author with most blogs', () => {
    const result = listHelper.mostBlogs(helper.blogs)
    assert.deepStrictEqual(result,
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})
