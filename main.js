const Handlebars=require("handlebars")
const puppeteer=require("puppeteer")
const fs=require("fs")
const printer=require("pdf-to-printer")

// Tsy ilaina fa azonla atao ihany ra tena tsy mahita fika ela
// Satria protocol http dia efa tafa
/*----------------------------------------*/

let getTemplate=async(path,data)=>{
    try{
        let html=fs.readFileSync(path,'utf-8')
        let template=Handlebars.compile(html)
        let res=template(data)
        let new_path=Date.now()+'.html'
        fs.writeFileSync(new_path,res,'utf-8')
        return new_path
    }catch(e){
        throw e
    }
}

// Migenerer PDF
/*---------------------------------------*/

let generatePdf=async (path,option)=>{
    const browser=puppeteer.launch()
    try{
        let page=await (await browser).newPage()
        await (await page).goto(path)
        await (await page).pdf(option)
        await (await browser).close()
    }catch(e){
        await (await browser).close()
        throw e
    }
}

/*-------------------------------------*/
getTemplate("index.html",{date:"01/04/2021",numero:"C256",heure:"15:52"})
.then(async (res)=>{
    let url="file://"+process.cwd()+"/"+res
    let option={format:'A4',path:"test.pdf"}
    try{
        await generatePdf(url,option)
        await printer.print(option.path)
        console.log("Fichier imprimé")
    }catch(e){
        console.log(e)
    }finally{
        fs.unlinkSync(res)
    }
})