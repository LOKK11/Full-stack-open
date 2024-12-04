import loginService from '../services/login'
import { useState } from 'react'
import { useBlogContext } from '../BlogContext'
import blogService from '../services/blogs'

const LoginForm = () => {
  const { setMessage, setUser } = useBlogContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      console.log('user', user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setMessage({ text: `Welcome ${user.name}`, type: 'success' })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    } catch (exception) {
      setMessage({ text: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    }
  }

  return (
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
}

export default LoginForm
