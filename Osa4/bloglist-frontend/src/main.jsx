import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BlogProvider } from './BlogContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BlogProvider>
    <App />
  </BlogProvider>
)