import { useState } from 'react'
import blogService from '../services/blogs'
import { useBlogContext } from '../BlogContext'

const CreateBlogForm = () => {
  const { setMessage, setFetchTrigger, fetchTrigger, setBlogs, blogs } = useBlogContext()
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setFetchTrigger(!fetchTrigger)
      setMessage({ text: `A new blog ${newTitle} added`, type: 'success' })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    } catch (exception) {
      setMessage({ text: 'Error adding blog', type: 'error' })
      setTimeout(() => {
        setMessage({ text: null, type: null })
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
				title:
          <input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
				author:
          <input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
				url:
          <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm
