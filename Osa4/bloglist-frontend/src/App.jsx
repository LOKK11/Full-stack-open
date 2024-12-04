import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import { useBlogContext } from './BlogContext'

const App = () => {
  // Use the useBlogContext so that you can access the states from all components
  const { blogs, setBlogs, fetchTrigger, message, setMessage } = useBlogContext()
  
  const [createBlogVisible, setCreateBlogVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username)

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({text: `Welcome ${user.name}`, type: 'success'})
      setTimeout(() => {
        setMessage({text: null, type: null})
      }, 5000)
    } catch (exception) {
      setMessage({text: 'Wrong credentials', type: 'error'})
      setTimeout(() => {
        setMessage({text: null, type: null})
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user}/>
      )}
    </div>
  )

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setMessage({text: 'Logged out', type: 'success'})
    setTimeout(() => {
      setMessage({text: null, type: null})
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
          <CreateBlogForm />
          <button onClick={() => setCreateBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message.text} type={message.type} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p> <button onClick={() => handleLogOut()}>logout</button>
        {createBlogForm()}
        {blogForm()}
      </div>
      }
    </div>
  )
}

export default App