import React, { useEffect, useRef } from "react";
import SignaturePad from "react-signature-canvas";
import styled from "styled-components";
import styles from "./styles.module.css";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .save-btn {
    background: rgba(54, 153, 255, 0.75);
    padding: 7px 35px;
    color: #fff;
    min-height: 25px;
    box-shadow: none;
    margin-right: 10px;
  }

  .clear-btn {
    padding: 7px 15px;
    color: #353535;
    min-height: 25px;
    box-shadow: none;
    font-size: 12px;
  }

  @media (max-width: 600px) {
    .clear-btn {
      font-size: 10px;
    }
  }

  @media (max-width: 400px) {
    flex-direction: column;

    .save-btn {
      margin-right: 0px;
      margin-bottom: 10px;
    }
  }
`;

const SignWrapper = styled.div`
  width: 100%;
  /* height: 200px; */
  margin: 20px auto 0 auto;
`;

const CanvasWrapper = styled.div`
  width: 80%;
  /* height: 80%; */
  height: 200px;
  margin: 0 auto 15px auto;
  background-color: #fff;
  border-radius: 3px;
  border: 2px dotted #cccccc;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

export default function ESign({
  formData,
  setFormData,
  clickedSubmit,
  setSignError,
  SignError,
}) {
  const sigRef = useRef(null);

  // const [dataURL, setDataURL] = useState();

  //   console.log(dataURL);

  function clear() {
    sigRef.current.clear();
  }

  useEffect(() => {
    // if (clickedSubmit) {
    clear();
    // }
  }, [clickedSubmit]);

  // useEffect(() => {
  //   // console.log(clickedSubmit);
  //   if (clickedSubmit) {
  //     // setDataURL(sigRef.current.getTrimmedCanvas().toDataURL("image/png"));
  //     setFormData({
  //       ...formData,
  //       signPhoto: sigRef.current.getTrimmedCanvas().toDataURL("image/png"),
  //     });
  //   }

  //   // console.log(formData);
  // }, [clickedSubmit]);

  // useEffect(() => {
  //   setFormData({
  //     ...formData,
  //     signPhoto: sigRef.current.getTrimmedCanvas().toDataURL("image/png"),
  //   });
  // }, [formData]);

  function trim() {
    // CanvasRenderingContext2D.getImageData().data
    // console.log(sigRef.current);
    setFormData({
      ...formData,
      signature: sigRef.current.getTrimmedCanvas().toDataURL("image/png"),
    });
    setSignError(false);
    // setDataURL(sigRef.current.getTrimmedCanvas().toDataURL("image/png"));
  }
  //   const [drawing, setDrawing] = useState(false);
  //   const [mousePos, setMousePos] = useState({
  //     x: 0,
  //     y: 0,
  //   });
  //   const [lastPos, setLastPos] = useState(mousePos);
  //   const [ctx, setCtx] = useState();

  //   const canvasRef = useRef(null);

  //   useEffect(() => {
  //     if (canvasRef.current !== null) {
  //       console.log(canvasRef);
  //       setCtx(canvasRef.current.getContext("2d"));
  //     }
  //   }, [canvasRef]);

  //   function requestAnimFrame() {
  //     window.requestAnimFrame = function(callback) {
  //       return (
  //         window.requestAnimationFrame ||
  //         window.webkitRequestAnimationFrame ||
  //         window.mozRequestAnimationFrame ||
  //         window.oRequestAnimationFrame ||
  //         window.msRequestAnimaitonFrame ||
  //         function(callback) {
  //           window.setTimeout(callback, 1000 / 60);
  //         }
  //       );
  //     };
  //   }

  //   function handleOnMouseDown(e) {
  //     setDrawing(true);
  //     setLastPos(getMousePos(canvasRef.current, e));
  //   }

  //   function handleOnMouseUp() {
  //     setDrawing(false);
  //   }

  //   function handleOnMouseMove(e) {
  //     setMousePos(getMousePos(canvasRef.current, e));
  //   }

  //   function handleOnTouchStart(e) {
  //     setMousePos(getTouchPos(canvasRef.current, e));
  //     var touch = e.touches[0];
  //     var me = new MouseEvent("mousedown", {
  //       clientX: touch.clientX,
  //       clientY: touch.clientY,
  //     });
  //     canvasRef.current.dispatchEvent(me);
  //   }

  //   function handleOnTouchMove(e) {
  //     var touch = e.touches[0];
  //     var me = new MouseEvent("mousemove", {
  //       clientX: touch.clientX,
  //       clientY: touch.clientY,
  //     });
  //     canvasRef.current.dispatchEvent(me);
  //   }

  //   function handleOnTouchEnd() {
  //     var me = new MouseEvent("mouseup", {});
  //     canvasRef.current.dispatchEvent(me);
  //   }

  //   function getMousePos(canvasDom, mouseEvent) {
  //     var rect = canvasDom.getBoundingClientRect();
  //     return {
  //       x: mouseEvent.clientX - rect.left,
  //       y: mouseEvent.clientY - rect.top,
  //     };
  //   }

  //   function getTouchPos(canvasDom, touchEvent) {
  //     var rect = canvasDom.getBoundingClientRect();
  //     return {
  //       x: touchEvent.touches[0].clientX - rect.left,
  //       y: touchEvent.touches[0].clientY - rect.top,
  //     };
  //   }

  //   function renderCanvas() {
  //     if (drawing) {
  //       setCtx(ctx.moveTo(lastPos.x, lastPos.y));
  //       setCtx(ctx.lineTo(mousePos.x, mousePos.y));
  //       setCtx(ctx.stroke());
  //       //   ctx.moveTo(lastPos.x, lastPos.y);
  //       //   ctx.lineTo(mousePos.x, mousePos.y);
  //       //   ctx.stroke();
  //       setLastPos(mousePos);
  //       //   lastPos = mousePos;
  //     }
  //   }

  //   useEffect(() => {
  //     requestAnimFrame();
  //     renderCanvas();
  //   }, []);

  // useEffect(() => {
  //     window.requestAnimFrame = (function(callback) {
  //         return window.requestAnimationFrame ||
  //           window.webkitRequestAnimationFrame ||
  //           window.mozRequestAnimationFrame ||
  //           window.oRequestAnimationFrame ||
  //           window.msRequestAnimaitonFrame ||
  //           function(callback) {
  //             window.setTimeout(callback, 1000 / 60);
  //           };
  // }, []);

  return (
    <>
      <SignWrapper>
        <Typography
          variant="h5"
          component="h5"
          style={{ textAlign: "center", marginBottom: "15px" }}
        >
          Sign in below to indicate that you agree to the terms of service
        </Typography>
        <CanvasWrapper>
          <SignaturePad
            //   canvasProps={{ className: padStyles }}
            penColor="black"
            canvasProps={{
              // width: "600",
              // height: "250",
              className: styles.sigPad,
            }}
            //   style={{ width: "100%" }}
            ref={sigRef}
          />
        </CanvasWrapper>
        <ButtonWrapper>
          <Button
            className="save-btn"
            // variant="contained"
            onClick={trim}
            // color="disabled"
          >
            Save Signature
          </Button>
          <Button
            variant="contained"
            onClick={clear}
            className="clear-btn"
            // color="disabled"
          >
            Clear Signature
          </Button>
          {SignError && (
            <FormHelperText
              color="primary"
              style={{
                color: "#f44336",
              }}
            >
              *Your Signatrue is required.
            </FormHelperText>
          )}
          {/* <button onClick={trim}>Trim</button> */}
        </ButtonWrapper>
      </SignWrapper>
      {/* <canvas
        id="sig-canvas"
        width="620"
        height="160"
        ref={canvasRef}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
        onTouchStart={handleOnTouchStart}
        onTouchMove={handleOnTouchMove}
        onTouchEnd={handleOnTouchEnd}
      ></canvas> */}
      {/* <div className="test" ref={testRef}></div> */}
    </>
  );
}
