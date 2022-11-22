import * as gm from "gammacv";
import * as R from "rambda";

import kernel from "./kernel.glsl";

import img from "../assets/image.js";

const WIDTH = 820;
const HEIGHT = 462;

const rootElement = document.querySelector("#root");

const removeTransparency = (previous) =>
  new gm.RegisterOperation("removeTransparency")
    .Input("tSrc", "uint8")
    .Output("uint8")
    .SetShapeFn(() => [HEIGHT, WIDTH, 4])
    .LoadChunk("pickValue")
    .GLSLKernel(kernel)
    .Compile({ tSrc: previous });

const process = async () => {
  const input = await gm.imageTensorFromURL(img, "uint8", [HEIGHT, WIDTH, 4]);

  const operations = R.pipe(
    (previous) => removeTransparency(previous),
    gm.grayscale,
    (previous) => gm.gaussianBlur(previous, 7, 3),
    gm.sobelOperator,
    (previous) => gm.cannyEdges(previous, 0.25, 0.75)
  )(input);

  const output = gm.tensorFrom(operations);

  const session = new gm.Session();

  session.init(operations);
  session.runOp(operations, 0, output);

  const inputCanvas = gm.canvasCreate(WIDTH, HEIGHT);
  const outputCanvas = gm.canvasCreate(WIDTH, HEIGHT);

  rootElement.append(inputCanvas);
  rootElement.append(outputCanvas);

  gm.canvasFromTensor(inputCanvas, input);
  gm.canvasFromTensor(outputCanvas, output);
};

process();
