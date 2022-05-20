// import logo from './logo.svg';
import './App.css';
import RecipeList from './components/recipe_list';
import RecipePost from './components/recipe_post';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VoiceRecognition } from './components/voice';

export function FallBack(props) {
  return <div>URL Not Found</div>;
}

function App() {
  return (
    <BrowserRouter>
     <div className="App">
     <VoiceRecognition />
      {/* <RecipeList /> */}
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/:recipeID" element={<RecipePost />} />
        <Route path="*" element={<FallBack />} />
      </Routes>
      
      {
      /* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
    
    </BrowserRouter>
   
  );
}

export default App;
