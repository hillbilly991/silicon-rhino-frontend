import {
  Routes,
  Route
}from 'react-router'
import { Home } from './pages'
import { Header } from './components'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={ <Home />} />
      </Routes>
    </>
  );
}

export default App;
