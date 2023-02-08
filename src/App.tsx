import React from 'react';
import './App.css';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';


function App() {
  return (
    <div className="App">
      <BlockMath math='\mathcal F[f(x)] = \int_{-\infty}^\infty f(x)e^{-i\omega x} \mathrm dx'/>
    </div>
  );
}

export default App;
