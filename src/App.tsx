import { useEffect, useState } from 'react';
import './App.css';
import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
// import { STATE } from "mathjax-full/js/core/MathItem";
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'

import TextareaAutosize from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import { Svg2Png } from 'svg2png-converter';
import parse from 'html-react-parser';

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
    const result = tex_html.convert(props.text);
    const svg = adaptor.innerHTML(result);
    setState(svg);
  }, [props]);

  return (
      <div id="mathCanvas">
        {parse(state)}
      </div>
  ); // `
}

//        <img src={`data:image/svg+xml;utf8,${state}`} id="mathCanvas" />

function App() {
  const [textState, setTextState] = useState<string>("");

  const handleTextInputChange = (event: any) => {
    setTextState(event.target.value);
  };

  const handleSavePngButtonPressed = (event: any) => {
    const svgSelector = document.querySelector('#mathCanvas > svg') as SVGSVGElement;
    const options = { scaleX: 8, scaleY: 8, embedCSS: true };
    Svg2Png.toDataURL(svgSelector, options).then(url => {
      const a = document.createElement("a")
      a.download = "equation.png";
      a.href = url;
      a.click();
      a.remove();
    });
  };

  return (
    <div className="App">
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder="Write equations here."
        style={{ width: 400 }}
        minRows={10}
        value={textState}
        onChange={handleTextInputChange}
      />
      <MathComponent text={textState}/>
      <Button onClick={handleSavePngButtonPressed}>Save PNG</Button>
    </div>
  );
}

export default App;
