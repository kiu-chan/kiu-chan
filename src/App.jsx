import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header>
        <h1>Welcome to Khanh's Website</h1>
        <p>Hi, I'm Khanh. Welcome to my personal website!</p>
      </header>

      <main>
        <section className="about">
          <h2>About Me</h2>
          <p>I'm a web developer who loves creating beautiful and functional websites.</p>
        </section>

        <section className="interactive">
          <h2>Let's Interact</h2>
          <p>You've clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>
            Click me!
          </button>
        </section>
      </main>

      <footer>
        <p>© 2025 Khanh's Website. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App