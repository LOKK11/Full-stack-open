/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import { useBlogContext } from './BlogContext'
import LoginForm from './components/LoginForm'

const App = () => {
  // Use the useBlogContext so that you can access the states from all components
  const { blogs, setBlogs, fetchTrigger, setFetchTrigger, message, setMessage, user, setUser } = useBlogContext()

  const [createBlogVisible, setCreateBlogVisible] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    }
    fetchData()
  }, [fetchTrigger])

  const handleLike = async blog => {
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

  const createBlog = async blogObject => {
    const response = await blogService.create(blogObject)
    setBlogs(blogs.concat(response))
  }

  const blogForm = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} />
      )}
    </div>
  )

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessage({ text: 'Logged out', type: 'success' })
    setTimeout(() => {
      setMessage({ text: null, type: null })
    }, 5000)
  }

  const createBlogForm = () => {
    const hideWhenVisible = { display: createBlogVisible ? 'none' : '' }
    const showWhenVisible = { display: createBlogVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateBlogVisible(true)}>New Blog</button>
        </div>
        <div style={showWhenVisible}>
          <CreateBlogForm createBlog={createBlog}/>
          <button onClick={() => setCreateBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message.text} type={message.type} />
      {!user && <LoginForm />}
      {
        user &&
        <div>
          <p>{user.name} logged in</p> <button onClick={() => handleLogOut()}>logout</button>
          {createBlogForm()}
          {blogForm()}
        </div>
      }
    </div>
  )
}

export default App