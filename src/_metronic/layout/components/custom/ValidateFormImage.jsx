// import React from "react";

export default function ValidateFormImage(
  e,
  setOpenSnack,
  openSnack,
  setURLImg,
  setFormData,
  formData,
  setImgEx,
  updateLoading,
  setUpdateLoading
) {
  if (!e.target.value) return;

  if (setUpdateLoading) {
    setUpdateLoading(true);
    // console.log("not ready");
  }

  if (e.target.files && e.target.files[0]) {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    var totalSizeMB = e.target.files[0].size / Math.pow(1024, 1);

    if (!allowedExtensions.exec(e.target.files[0].name)) {
      setOpenSnack({
        ...openSnack,
        openSnackOpen: true,
        message: "Invalid File Type",
        title: "invalid file type",
      });

      e.target.value = "";
      setURLImg("");
      return false;
    } else if (totalSizeMB > 300) {
      setOpenSnack({
        ...openSnack,
        openSnackOpen: true,
        message: "Image can't be larger than 300KB",
        title: "image large",
      });

      e.target.value = "";
      setURLImg("");
      return false;
    } else {
      let reader = new FileReader();

      // var reader = new FileReader();
      // var fileByteArray = [];
      // reader.readAsArrayBuffer(e.target.filesp[0]);
      // reader.onloadend = function(evt) {
      //   if (evt.target.readyState == FileReader.DONE) {
      //     var arrayBuffer = evt.target.result,
      //       array = new Uint8Array(arrayBuffer);
      //     for (var i = 0; i < array.length; i++) {
      //       fileByteArray.push(array[i]);
      //     }
      //   }
      // };

      // console.log(fileByteArray);
      reader.onload = function(e) {
        // if (newValues) {
        //   setNewValues({
        //     ...newValues,
        //     photo_Path: reader.result.split(";base64,")[1],
        //   });
        // } else {

        // console.log(reader.result);
        setFormData({
          ...formData,
          photo_Path: reader.result.split(";base64,")[1],
        });
        // }
      };

      reader.readAsDataURL(e.target.files[0]);
      if (setImgEx) {
        console.log(e.target.files);
        setImgEx(URL.createObjectURL(e.target.files[0]));
      }
      setURLImg(e.target.value.split("C:\\fakepath\\")[1]);
      // URL.revokeObjectURL(e.target.files[0]);
      if (setUpdateLoading) {
        setUpdateLoading(false);
        // console.log("ready");
      }
      e.target.value = "";
    }
  }
}
