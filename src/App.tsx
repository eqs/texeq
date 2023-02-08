import { useEffect, useState } from 'react';
import './App.css';
import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { STATE } from "mathjax-full/js/core/MathItem";
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'

// https://github.com/mathjax/MathJax/issues/2385#issuecomment-1253051223

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)

const tex = new TeX({ packages: ["base", "ams"] });
const svg = new SVG({ fontCache: "none" });
const tex_html = mathjax.document("", {
  InputJax: tex,
  OutputJax: svg,
});

const MathComponent = (props: { text: string }) => {
  const [state, setState] = useState<string>("");
  useEffect(() => {
    let result = tex_html.convert(props.text);
    setState(adaptor.innerHTML(result));
  }, [props]);
  return (
      <div>
        <img src={`data:image/svg+xml;utf8,${state}`} />
      </div>
  ); // `
}


function App() {
  return (
    <div className="App">
      <MathComponent text='F(\omega) = \mathcal F[f(x)] = \int_{-\infty}^\infty f(x)e^{-i\omega x} \mathrm dx'/>
    </div>
  );
}

export default App;
