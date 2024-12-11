const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('most likes', () => {
  test('when list has only one blog return the author of that', () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog)
    assert.deepStrictEqual(result,
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('when list has no blogs return null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs return the author with the most total likes', () => {
    const result = listHelper.mostLikes(helper.blogs)
    assert.deepStrictEqual(result,
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })
})
