import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ searchWith, handleSearchChange }) => {
  return (
    <div>
      Filter shown with:
      <input
        value={searchWith}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number:
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <ul>
      {
        personsToShow.map(person =>
          <li key={person.name}>
            {person.name + ' ' + person.number + ' '}
            <button value={person.id} onClick={handleDelete}>Delete</button>
          </li>
        )
      }
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchWith, setSearchWith] = useState('')
  const [message, setMessage] = useState({ text: null, type: null })

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
        .then(initialPersons => {
          console.log('promise fulfilled')
          setPersons(initialPersons)
        })
  }
  useEffect(hook, [])

  const personsToShow = searchWith === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(searchWith.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
            setMessage({ text: `Updated ${newName}`, type: 'success' })
            setTimeout(() => {
              setMessage({ text: null, type: null })
            }, 5000)
          })
          .catch(error => {
            setMessage({ text: error.response.data.error, type: 'error' })
            setTimeout(() => {
              setMessage({ text: null, type: null })
            }, 5000)
            console.log(error.response.data)
          })
        setNewName('')
        setNewNumber('')
      }
      return
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setMessage({ text: `Added ${newName}`, type: 'success' })
        setTimeout(() => {
          setMessage({ text: null, type: null })
        }, 5000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setMessage({ text: error.response.data.error, type: 'error' })
        setTimeout(() => {
          setMessage({ text: null, type: null })
        }, 5000)
        console.log(error.response.data)
      })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearchWith(event.target.value)
  }

  const handleDelete = (event) => {
    const id = event.target.value
    const deletedPerson = persons.find(person => person.id === id)
    if (window.confirm("Are you sure you want to delete this person?")) {
      personService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage({ text: `Deleted ${deletedPerson.name}`, type: 'success' })
          setTimeout(() => {
            setMessage({ text: null, type: null })
          }, 5000)
        })
        .catch(error => {
          setMessage({ text: `Information of ${deletedPerson.name} has already been removed from the server`, type: 'error' })
          setTimeout(() => {
            setMessage({ text: null, type: null })
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message.text} type={message.type} />
      <h2>Search</h2>
      <Filter
        searchWith={searchWith}
        handleSearchChange={handleSearchChange}
      />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        personsToShow={personsToShow} 
        handleDelete={handleDelete}  
      />
    </div>
  )

}

export default App