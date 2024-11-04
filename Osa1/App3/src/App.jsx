import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Header = ({ text }) => <h1>{text}</h1>

const Paragraph = ({ text }) => <p>{text}</p>


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const nextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }
  const [points, setPoints] = useState(
    {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0
    }
  )
  const copy = { ...points }

  const updatePoints = () => {
    copy[selected] += 1
    setPoints(copy)
  }

  const maxKey = Object.entries(points).reduce((max, current) => {
    return current[1] > max[1] ? current : max;
  })[0];


  return (
    <div>
      <Header text="Anecdote of the day" />
      <Paragraph text={anecdotes[selected]} />
      <Paragraph text={`Has ${points[selected]} votes`} />
      <Button handleClick={nextAnecdote} text="Next anecdote" />
      <Button handleClick={updatePoints} text="Vote" />
      <Header text="Anecdote with most votes" />
      <Paragraph text={anecdotes[maxKey]} />
    </div>
  )
}

export default App