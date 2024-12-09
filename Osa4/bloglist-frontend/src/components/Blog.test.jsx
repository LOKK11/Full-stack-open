import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { useBlogContext } from '../BlogContext'
import { expect, test, vi } from 'vitest'

vi.mock('../BlogContext', () => ({
  useBlogContext: vi.fn()
}))


describe('<Blog />', () => {
  test('Blog shows only the title of the blog by default', async () => {
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
      user: {
        username: 'testuser'
      }
    })

    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('#DefaultBlogView')
    expect(div).toBeInTheDocument()
    expect(div).toHaveTextContent('Test blog')
    expect(div).not.toHaveTextContent('http://example.com')
    expect(div).not.toHaveTextContent('likes')
  })

  test('Blog shows all the details of the blog after clicking the view button', async () => {
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
      user: {
        username: 'testuser'
      }
    })

    const { container } = render(<Blog blog={blog} />)
    const button = screen.getByText('view')
    await userEvent.click(button)
    const div = container.querySelector('#DetailedBlogView')
    expect(div).toBeInTheDocument()
    expect(div).toHaveTextContent('Test blog')
    expect(div).toHaveTextContent('http://example.com')
    expect(div).toHaveTextContent('likes')
  })

  test('Blog calls the like handler when the like button is clicked', async () => {
    const blog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'http://example.com',
      likes: 0,
      user: {
        name: 'Test user',
        username: 'testuser',
      }
    }

    useBlogContext.mockReturnValue({
      setFetchTrigger: vi.fn(),
      fetchTrigger: false,
      user: {
        username: 'testuser'
      }
    })

    const mockHandleLike = vi.fn()

    render(<Blog blog={blog} handleLike={mockHandleLike} />)
    const likeButton = screen.getByText('like')

    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockHandleLike).toHaveBeenCalledTimes(2)
  })
})
