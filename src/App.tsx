import { useEffect, useState } from 'react';
import './App.css';
import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { STATE } from "mathjax-full/js/core/MathItem";
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'

import TextareaAutosize from '@mui/base/TextareaAutosize';

import {
    initializeImageMagick,
    ImageMagick,
    Magick,
    MagickFormat,
} from '@imagemagick/magick-wasm';

initializeImageMagick().then(async () => {
  console.log(Magick.imageMagickVersion);
  ImageMagick.read('logo:', image => {
      image.resize(100, 100);
      image.blur(1, 5);
      console.log(image.toString());

      image.write(data => {
          console.log(data.length);
      }, MagickFormat.Jpeg);
  });
});

// https://github.com/mathjax/MathJax/issues/2385#issuecomment-1253051223

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)

const tex = new TeX({ packages: ["base", "ams"] });
const svg = new SVG({ fontCache: "none" });
const tex_html = mathjax.document("", {
  InputJax: tex,
  OutputJax: svg,
});

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

const MathComponent = (props: { text: string }) => {
  const [mathState, setMathState] = useState<string>("");
  const [context, setContext] = useState<CanvasRenderingContext2D|null>(null);

  useEffect(() => {
    let result = tex_html.convert(props.text);
    setMathState(adaptor.innerHTML(result));
  }, [props]);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasContext = canvas.getContext("2d");
    setContext(canvasContext);
  });

  useEffect(() => {
    if (context !== null) {
      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${mathState}`;
      img.onload = () => {
        console.log("drawing");
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(img, 0, 0);
      };
    }
  }, [context, mathState]);

  return (
    <div>
      <img src={`data:image/svg+xml;utf8,${mathState}`} />
      <canvas id="canvas"></canvas>
    </div> //`
  );
}

// <div>
//      <img src={`data:image/svg+xml;utf8,${mathState}`} />
//     <canvas width="1280" height="720" id="canvas"></canvas>
// </div>

function App() {
  const [textState, setTextState] = useState<string>("");

  const handleTextInputChange = (event: any) => {
    setTextState(event.target.value);
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
    </div>
  );
}

export default App;
