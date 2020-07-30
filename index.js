// IMPORTANDO A FUNCAO FILE STREAN

import {promises as fs} from "fs";

// DECLARANDO AS VARIAVEIS GLOBAIS

let estados = null;
let cidades = null;
let globalEstados = null;
let globalCidades = null;
let mergeEstados = [];
let ufJsonCode = [];
let uf = null;
let cidadeMaior = null;
let cidadeMaiorFilter = null;
let cidadeMenor = null;
let cidadeMenorFilter = null;
let ufCidades = [];
let cidadesMais = null;
let pushEstadosMais = [];
let cma = [];
let cmb = [];
let cm = [];
let cmao = [];
let cmo = [];

// FUNÇÃO PRINCIPAL

async function start(){

  await readJsonEstados();
  await readJsonCidades();
  await globalUF();
  await globalCid();
  await mergeEstadosCidades();
  await ufJson();
  await estadosMais();
  await ordenadosMais();
  await ordenadosMenos();
  await maiorNome();
  await menorNome();
  // await geraJson();


}

// LER ARQUIVO JSON DOS ESTADOS

async function readJsonEstados(){
  try {
    
    estados = JSON.parse(await fs.readFile('estados.json', 'utf-8'));
    // console.log(estados);
    
  } catch (err) {
    console.log(err);
  }
}

// LER ARQUIVO JSON DAS CIDADES

async function readJsonCidades(){
  try {
    
    cidades = JSON.parse(await fs.readFile('cidades.json', 'utf-8'));
    // console.log(cidades);
    
  } catch (err) {
    console.log(err);
  }
}

// CRIAR UM MAP DOS ESTADOS

async function globalUF(){
  try {
    globalEstados = estados.map(({ID, Sigla}) => {
      return {
        idUf: ID,
        uf: Sigla,
      };
    });
    // console.log(globalEstados);
  } catch (error) {
    console.log(error);
  }
}

// CRIAR UM MAP DAS CIDADES

async function globalCid(){
  try{
    globalCidades = cidades.map(({Nome, Estado}) => {
      return {
        idUf: Estado,
        cidade: Nome,
      };
    });
    // console.log(globalCidades);
  } catch (err) {
    console.log(err);
  }
}

// CRIAR UM MAP SÓ DAS UFs

async function ufJson(){
  try{
    ufJsonCode = globalEstados.map(({uf}) => {
      return {
        ufCode: uf,
      };
    });
    // console.log(ufJsonCode);
  } catch (err) {
    console.log(err);
  }
}

// MESCLAR ARQUIVO DE ESTADOS E CIDADES

async function mergeEstadosCidades(){
  try {
  globalCidades.forEach(cidades => {
    const estado = globalEstados.find(
      (estado) => estado.idUf === cidades.idUf
    );
    mergeEstados.push({
      cidade: cidades.cidade,
      uf: estado.uf,
    });
  });

    // console.log(mergeEstados);
    
  } catch (error) {
    console.log(error);
  }
}

// GERAR ARQUIVO JSON DE CADA UF COM SUAS CIDADES

async function geraJson(){
  try {
    for(let item of ufJsonCode){
      uf = item.ufCode.toLowerCase();
      console.log(uf);
      ufCidades = mergeEstados.filter(cidade => {
        let cidadeCase = cidade.uf;
        return cidadeCase.includes(item.ufCode);    
      });
      // const ufCidadesFilter = ufCidades.map(({cidade, uf}) => {
      //   return {
      //     cidade: cidade,
      //   };
      // });
      await fs.writeFile(uf + '.json', JSON.stringify(ufCidades, null, '\t'));
    }
  } catch (error) {
    console.log(error);
  }
}

// LER ARQUIVOS JSON DAS UFs E FILTRAR ESTADOS COM MAIS CIDADES

async function estadosMais(){
  for(let ufMais of ufJsonCode){
      cidadesMais = JSON.parse(await fs.readFile(ufMais.ufCode + '.json', 'utf-8'));    
      let estadosMais = cidadesMais.reduce((acc, curent) => {
        return acc + (curent.uf === ufMais.ufCode);
      }, 0);
      cidadeMaior = cidadesMais.map(({uf, cidade}) => {
        return {
          cidade: cidade,
          uf: uf,
        }
      }).sort((a,b) => {
      return  b.cidade.length - a.cidade.length;
      });

        cma.push({...cidadeMaior[0]});
        cmb = cidadeMaior.reverse();
        cm.push({...cmb[0]});
        
        pushEstadosMais.push({
          uf: ufMais.ufCode,
          cidades: estadosMais
        });    
      }
      // console.log(cm);
      // console.log(cma);
}

// ORDENAR MAIOR NOME CIDADE E MENOR NOME CIDADE E MAIOR E MENOR NOME TOTAL

async function maiorNome(){
  try {
    cmao = cma.sort((a, b) => {
      return b.cidade.length - a.cidade.length;
    })
    // console.log(cmao);
    console.log(cmao[0]);
  } catch (error) {
    console.log(error);
  }
}
async function menorNome(){
  try {
    cmo = cm.sort((a, b) => {
      return a.cidade.length - b.cidade.length;
    })
    // console.log(cmo);    
    console.log(cmo[0]);    
  } catch (error) {
    console.log(error);
  }
}

// ORDENAR ESTADOR COM MAIS CIDADES E COM MENOS CIDADES

async function ordenadosMais(){
  try {
    const cresc = pushEstadosMais.sort((a, b) => {
      return b.cidades - a.cidades;
    })
    let a = [];
    for (let i = 0; i < 5; i++){
      let b = cresc[i];
      a.push({...b});
    }    
    console.log(a);
  } catch (error) {
    console.log(error);
  }
}
async function ordenadosMenos(){
  try {
    const decresc = pushEstadosMais.sort((a, b) => {
      return a.cidades - b.cidades;
    })
    let a = [];
    for (let i = 4; i >= 0; i--){
      let b = decresc[i];
      a.push({...b});
    }    
    console.log(a);
  } catch (error) {
    console.log(error);
  }
}

// LISTAR CIDADES COM MAIOR E MENOR NOME




start();