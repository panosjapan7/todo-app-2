import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Welcome />} />  */}
        <Route path="/register" element={<Register />} /> 
      </Routes>
    </div>
  );
}

export default App;
