// const saveAs = require("./filesaver");
async function zipFile (zip, contentName) {
    zip.generateAsync({type:"blob"}).then(zip => {
        // see FileSaver.js
        saveAs(zip, contentName + ".zip")
    })
}
const readAsBinaryString = blob => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function(event) {
      resolve(event.target.result);
    };
    reader.readAsBinaryString(blob);
  });
  
async function getBlobContent (url, contentName) {
    let blob = await fetch(url).then(r => r.blob())
    saveAs(blob, contentName)
}
async function getMultiBlobContent (realLinks, metaReal, mainName) {
    let zip = new JSZip()
    for (let realLink of realLinks) {
        let blob = await fetch(realLink.realLink).then(r => r.blob())
        zip.file(realLink.realLinkName, await readAsBinaryString(blob), {binary: true})
    }
    if (mainName === "") {
        zipFile(zip, metaReal)
    } else {
        zipFile(zip, metaReal + "-" + mainName)
    }
}
function generateDownloadButton() {
    let imgs = document.getElementsByTagName("img");
    for (let img of imgs) {
        if (img.src === window.location.protocol + "//" + window.location.hostname +  "/view/image/filetype/torrent.gif") {
            let linkP = img.parentNode
            linkP.href = linkP.href.replace("dialog", "download")
            let tr = linkP.parentNode.parentNode
            let newTd = tr.appendChild(document.createElement("td"))
            let downLoadButton = newTd.appendChild(document.createElement("img"))
            downLoadButton.src = browser.runtime.getURL("img/cloud-arrow-down-fill.svg")
            downLoadButton.className = "mouse-on"
            downLoadButton.style = "width:1.5rem;height:100%"
            let loading = newTd.appendChild(document.createElement("div"))
            loading.className = "spinner-border spinner-border-sm"
            loading.style = "display:none"
            downLoadButton.addEventListener('click', () => {
                downLoadButton.style = "display:none"
                loading.style = ""
                let downloadFileName = linkP.innerText
                if (downloadFileName.search("torrent") === -1) {
                    downloadFileName = downloadFileName + ".torrent"
                }
                getBlobContent(linkP.href, downloadFileName).then(() => {
                    setTimeout(
                        () => {
                            loading.style = "display:none"
                            downLoadButton.style = "width:1.5rem;height:100%"
                        },200
                    )
                })
              })

        }
    }
    let tds = document.getElementsByTagName("td")
    let metas = document.getElementsByTagName("meta")
    let metaReal = ""
    for (let meta of metas) {
        if (meta.name === "keywords") {
            metaReal = meta.content
            metaReal = metaReal.replace("<", "-")
                               .replace(">", "-")
                               .replace(":", "-")
                               .replace("\"", "-")
                               .replace("/", "-")
                               .replace("|", "-")
                               .replace("?", "-")
                               .replace("*", "-")

        }
    }
    for (let td of tds) {
        if (td.className === "bold") {
            let headtr = td.parentNode
            let headdiv = headtr.parentNode.parentNode.parentNode
            let mainName = ""
            if (headdiv.parentNode.getElementsByTagName("h2").length === 0) {
                mainName = headdiv.parentNode.getElementsByTagName("p")[0].innerText
                mainName = mainName.replace("<", "-")
                .replace(">", "-")
                .replace(":", "-")
                .replace("\"", "-")
                .replace("/", "-")
                .replace("|", "-")
                .replace("?", "-")
                .replace("*", "-")
            }
            let pacDownLoad = td.appendChild(document.createElement("img"))
            // width="23rem"
            pacDownLoad.width = "23rem"
            pacDownLoad.src = browser.runtime.getURL("img/file-earmark-zip-fill.svg")
            pacDownLoad.className = "mouse-on"
            pacDownLoad.style = "padding-left: 10px;width:1.5rem;height:100%"
            let loading = td.appendChild(document.createElement("div"))
            loading.className = "spinner-border spinner-border-sm"
            loading.style = "display:none"

            pacDownLoad.addEventListener('click', () => {
                loading.style = "margin-left:10px"
                pacDownLoad.style = "display:none"
                let nextTr = headtr.nextSibling
                let realLinks = []
                while(nextTr) {
                    if (nextTr.nodeType !== Node.TEXT_NODE) {
                        let fileLinkTag = nextTr.getElementsByTagName("a");
                        let realFileLinkTag = fileLinkTag[0]
                        if (realFileLinkTag) {
                            let realLink = realFileLinkTag.href.replace("dialog", "download")
                            let realLinkName = realFileLinkTag.innerText
                            if (realLinkName.search("torrent") === -1) {
                                realLinkName = realLinkName + ".torrent"
                            }
                            realLinks.push({
                                realLink: realLink,
                                realLinkName: realLinkName
                            })
                        }
                    }
                    nextTr = nextTr.nextSibling
                }
                getMultiBlobContent(realLinks, metaReal, mainName).then(() => {
                    setTimeout(
                        () => {
                            loading.style = "display:none"
                    pacDownLoad.style = "padding-left: 10px;width:1.5rem;height:100%"
                        },800
                    )
                })
              })
            let newTd = headtr.appendChild(document.createElement("td"))
            newTd.className = "grey"
            newTd.width = "70"
            newTd.innerText = "Direct"
        }
    }
}
generateDownloadButton();