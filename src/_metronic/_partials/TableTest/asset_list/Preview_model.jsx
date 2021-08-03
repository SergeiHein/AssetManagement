import React from "react";
import styled from "styled-components";
import { Portal } from "react-portal";

// const Overlay_Styles = styled.div`
//   width: 100px;
//   height: 100px;
//   position: fixed;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
// `;

// const WrapperPreview = styled.div`
//   width: 100%;
//   height: 100vh;
//   position: fixed;
//   background: rgba(0, 0, 0, 0.6);
//   z-index: 100000;
// `;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const WrapperPreview = styled.div`
  width: 100%;
  height: 100vh;
  cursor: pointer;
  display: flex;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
`;

const PreviewImgStyles = styled.div`
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /* position: fixed; */
  /* left: 50%; */
  /* top: 50%; */
  /* transform: translate(-50%, -50%); */
`;

export default function Preview_model({
  openPreviewImg,
  setOpenPreviewImg,
  previewImg,
  server_path,
  onClose,
}) {
  // const modelRef = useRef(null);

  console.log(previewImg);
  return (
    <Portal node={document && document.getElementById("preview-portal")}>
      {/* <div>this is preview</div> */}
      <WrapperPreview onClick={() => setOpenPreviewImg(false)}>
        <PreviewImgStyles>
          <PreviewImg
            src={`${server_path}Uploads/asset-photos/${previewImg}.jpg?${new Date().getTime()}`}
            alt="asset"
            title={`asset ${previewImg} image`}
            onError={(e) => {
              if (e.target.src.includes(".jpg")) {
                // console.log("changing to png ..");
                e.target.src = `${server_path}Uploads/asset-photos/${previewImg}.png?${new Date().getTime()}`;
                return;
              }
              if (e.target.src.includes(".png")) {
                // console.log("chaning to jpeg ..");
                e.target.src = `${server_path}Uploads/asset-photos/${previewImg}.jpeg?${new Date().getTime()}`;
                return;
              }
              if (e.target.src.includes(".jpeg")) {
                // console.log("changing to gif ..");
                e.target.src = `${server_path}Uploads/asset-photos/${previewImg}.gif?${new Date().getTime()}`;
                return;
              } else {
                if (e.target.src.includes(".gif")) {
                  e.target.src = "https://i.imgur.com/s6qHduv.jpeg";
                  e.target.classList.add("error-img");
                }
              }
            }}
          />
          {/* <button onClick={() => setOpenPreviewImg(false)}>Close</button> */}
        </PreviewImgStyles>
      </WrapperPreview>
    </Portal>
  );
}
