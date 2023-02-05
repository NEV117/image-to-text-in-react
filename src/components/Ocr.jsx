import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { AiOutlineFileImage } from "react-icons/ai";

const Ocr = () => {
  const [file, setfile] = useState();
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setfile(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setError(null);
      setProgress(0);
    }
  };

  const processImage = () => {
    if (!file) {
      setError("Debes seleccionar una imagen !!!");
      return;
    }

    setProgress(0.01);
    Tesseract.recognize(file, "spa", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })

      .catch((err) => {
        setError("No se puede escanear la imagen");
        console.error(err);
      })
      .then(({ data: { text } }) => {
        setCodigo(text);
      });
  };

  return (
    <div className=" flex flex-col justify-center col-span-1 mt-5">
      <div className="mx-auto  gap-4  px-5 rounded  m-5 max-w-4xl">
        <div className="izquierdo py-3">
          <div className=" pb-3">
            <h3 className="text-white">
              <strong>Escanear imagen a texto</strong>
            </h3>
          </div>

          <textarea
            className={
              "p-5 bg-[#615656] text-white border border-blue-500 w-full max-w-[600px] min-h-[300px]  rounded "
            }
            onChange={(e) => setCodigo(e.target.value)}
            value={codigo}
          />
        </div>

        <div className=" flex flex-col justify-center items-center max-w-[600px] bg-[#615656]  border  border-blue-500 rounded">
          {image ? (
            <img
              className="rounded bg-cover md:max-w-[300px] "
              src={image}
              alt="preview"
            />
          ) : (
            <AiOutlineFileImage
              className=" mx-auto  px-8 "
              size={165}
              color="#3c81f1"
            ></AiOutlineFileImage>
          )}
        </div>
        <div className="grid grid-cols-2 px-2 gap-2" style={{ marginTop: 25 }}>
          <input
            id="file_input"
            className="block w-full text-sm bg-[#615656] text-gray-900 rounded-lg border border-blue-400 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          ></input>
          <input
            className=" bg-blue-400 hover:bg-blue-300 px-4  rounded mx-auto"
            type="button"
            value="Escanear"
            onClick={processImage}
          ></input>
        </div>
        {/*   esto es un condicoinal para que solo lo muestre cuando halla un error */}
        {error && (
          <div className=" py-2.5 px-2.5  text-lg bg-[#494141]  border-2  border-red-600 rounded m-5 text-white ">
            {error}
          </div>
        )}
        {/* muestra el progreso solo cuando hay progreso*/}
        {progress !== 0 && (
          <div className="px-3">
            <progress
              className="w-full  bg-gray-200 border rounded-full h-2.5 dark:bg-gray-700"
              value={progress}
              max={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ocr;
