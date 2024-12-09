import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useBlogContext } from '../BlogContext'
import { expect, test, vi } from 'vitest'
import CreateBlogForm from './CreateBlogForm'

vi.mock('../BlogContext', () => ({
  useBlogContext: vi.fn()
}))

describe('<CreateBlogForm />', () => {
  test('calls the event handler with the right details when a new blog is created', async () => {
    const blog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://example.com',
      likes: 0,
      user: {
        name: 'Test user',
        username: 'testuser'
      }
    }

    useBlogContext.mockReturnValue({
      setFetchTrigger: vi.fn(),
      fetchTrigger: false,
      setMessage: vi.fn(),
      user: {
        username: 'testuser'
      }
    })

    const user = userEvent.setup()
    const mockCreateBlog = vi.fn()

    const { container } = render(<CreateBlogForm createBlog={mockCreateBlog}/>)
    const title = container.querySelector('#title')
    await user.type(title, blog.title)
    const author = container.querySelector('#author')
    await user.type(author, blog.author)
    const url = container.querySelector('#url')
    await user.type(url, blog.url)
    const button = container.querySelector('button')

    screen.debug(container)
    await user.click(button)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe(blog.title)
    expect(mockCreateBlog.mock.calls[0][0].author).toBe(blog.author)
    expect(mockCreateBlog.mock.calls[0][0].url).toBe(blog.url)
  })
})