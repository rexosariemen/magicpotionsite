import React from 'react';
import './App.css';
import MagicPotion from './components/MagicPotionContainer';

function App() {
  return (
    <div className="App">
      <h2>Curology Magic Potion<span><img alt="" height="50px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRUM5k7XvVB87iuS7oepkQppa4H6nI4pL4n9g&usqp=CAU"></img></span></h2>
      <MagicPotion />
    </div>
  );
}

export default App;