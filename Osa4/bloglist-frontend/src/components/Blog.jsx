import { useState } from 'react'
import blogService from '../services/blogs'
import { useBlogContext } from '../BlogContext'

const Blog = ({ blog, handleLike }) => {
  const { setFetchTrigger, fetchTrigger, user } = useBlogContext()
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

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
    }
    setFetchTrigger(!fetchTrigger)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} id="DefaultBlogView">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} id="DetailedBlogView">
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
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
