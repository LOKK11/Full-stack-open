const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('total likes', () => {
  test('when list has only one blog return that', () => {
    const result = listHelper.favouriteBlog(helper.listWithOneBlog)
    assert.deepStrictEqual(result,
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('when list has no blogs return null', () => {
    const result = listHelper.favouriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs return the one with the most likes', () => {
    const result = listHelper.favouriteBlog(helper.blogs)
    assert.deepStrictEqual(result,
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    )
  })
})
