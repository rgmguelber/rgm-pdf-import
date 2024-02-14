 import parsePDF from "@/actions/actPDFReader";
import fs from "fs";

export default async function Home() {
  
  const pdfBuffer = fs.readFileSync("./pdfs/fevereiro.pdf");

  const conteudo = await parsePDF(pdfBuffer);

   
  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl text-red-600" >PDF Import</h1>

      <div className="w-full m-4 p-4 flex justify-center items-center gap-4">
        <button className=" text-blue-600 text-xl">
          Importar XP
        </button>

        <button className= "text-blue-600 text-xl">
          Importar Feveiro
        </button>

      </div>

      <div>

      </div>


    </main>
  );
}
