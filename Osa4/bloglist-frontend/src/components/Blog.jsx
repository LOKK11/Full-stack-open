import { useState } from 'react'
import blogService from '../services/blogs'
import { useBlogContext } from '../BlogContext'

const Blog = ({ blog, user }) => {
  const { setFetchTrigger, fetchTrigger } = useBlogContext()
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    await blogService.update(
      blog.id,
      {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
    )
    setFetchTrigger(!fetchTrigger)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
    }
    setFetchTrigger(!fetchTrigger)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick={handleLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          {blog.user.username === user.username && <button onClick={handleDelete}>remove</button>}
        </div>
      </div>
    </div>
  )
}

export default Blog
