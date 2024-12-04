import React, { createContext, useState, useContext } from 'react'

const BlogContext = createContext()

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([])
  const [fetchTrigger, setFetchTrigger] = useState(false)
  const [message, setMessage] = useState({ text: null, type: null })

  return (
    <BlogContext.Provider value={{ blogs, setBlogs, fetchTrigger, setFetchTrigger, message, setMessage }}>
      {children}
    </BlogContext.Provider>
  )
}

export const useBlogContext = () => useContext(BlogContext)
