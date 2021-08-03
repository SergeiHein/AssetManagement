import React from "react";
import styled from "styled-components";

import { Portal } from "react-portal";

const PreviewImg = styled.img`
  width: 80%;
  height: 80%;
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
  color: "#fff";
`;

export default function ShowSignature({ previewImg, setOpenPreviewImg }) {
  return (
    <Portal node={document && document.getElementById("preview-portal")}>
      <WrapperPreview onClick={() => setOpenPreviewImg(false)}>
        <PreviewImgStyles>
          <PreviewImg src={`${previewImg?.base64String}`} />
        </PreviewImgStyles>
      </WrapperPreview>
    </Portal>
  );
}
