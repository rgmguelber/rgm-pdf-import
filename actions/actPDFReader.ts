"use server";

import fs from "fs";
import PdfParser from "pdf2json";

type OperacoesType = {
  nota_corretagem: number;
  data_pregao: Date;
  ativo: string;
  tipo_operacao: string;
  preco: number;
  lote: number; 
  custo_operacao: number;
}

type ArrayLinhasType = {
  pagina: number;
  linha: number;
  texto: string;
}

function montaArrayLinhas(pdfData: any) {
  const arrayLinhas: ArrayLinhasType[] = [];
  let pagina, caracter, linhaAtual = 0;
  let texto = "";

  for (pagina=0; pagina<pdfData.Pages.length; pagina++) {
    linhaAtual = pdfData.Pages[pagina].Texts[0].y;
    texto = "";
    for (caracter=0; caracter<pdfData.Pages[pagina].Texts.length; caracter++) {
      if (linhaAtual !== pdfData.Pages[pagina].Texts[caracter].y) {
        arrayLinhas.push({
          pagina: pagina,
          linha: linhaAtual,
          texto: texto,
        })

        texto = "";
        linhaAtual = pdfData.Pages[pagina].Texts[caracter].y;
      }

      // Filtro de Letras em Negrito
      // if (pdfData.Pages[pagina].Texts[caracter].R[0].TS[0] === 0 && pdfData.Pages[pagina].Texts[caracter].R[0].TS[1] === 17 && pdfData.Pages[pagina].Texts[caracter].R[0].TS[2] === 1 && pdfData.Pages[pagina].Texts[caracter].R[0].TS[3] === 0)
      texto = texto + decodeURIComponent(pdfData.Pages[pagina].Texts[caracter].R[0].T);
    }        
  }
  return arrayLinhas;
}

function localizaProximaString(start: number = 0, lista: ArrayLinhasType[], search: string) {
  let index = start;

  while (lista[index].texto.indexOf(search) < 0 && index < lista.length) index++;

  return index;
}

function buscaOperacoes(dados: ArrayLinhasType[]) {
  const operacoes: OperacoesType[] = [];
  let nota_corretagem = 0;
  let data_pregao = new Date('1900-01-01');

  let index = 0;

  console.log('buscaOperacoes iniciado...')
  // Localiza a data do pregão
  index = localizaProximaString(index, dados, 'Data pregão')
  if (index < dados.length) {
    data_pregao = new Date(dados[index+1].texto);
    console.log('Data Pregão: ', data_pregao);
  }
  // Localiza o número da nota de corretagem 
  index = localizaProximaString(index, dados, 'Nº Nota');
  if (index < dados.length) {
    nota_corretagem = parseInt(dados[index+1].texto);
    console.log('Nota Corretagem: ', nota_corretagem);
  }



}

function parsePDF(pdfBuffer: any){
  return new Promise((resolve, reject) => {
    const pdfParser = new PdfParser();
    pdfParser.on('pdfParser_dataReady', pdfData => {
      try {
        // console.log(pdfData)
        const data = montaArrayLinhas(pdfData);
        // fs.writeFile('./pdfs/fevereiro.json', JSON.stringify(data), () => null)
        
        
        buscaOperacoes(data);
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
    pdfParser.on('pdfParser_dataError', errData => reject(errData))
    pdfParser.parseBuffer(pdfBuffer)
  })
}

export default parsePDF;