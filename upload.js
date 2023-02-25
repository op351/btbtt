
function attach_file_type(type) {
	var type = type.toLowerCase();
    var filetypes = { "av": ["av", "wmv", "wav", "wma", "avi"],
                      "real": ["rm", "rmvb"], 
                      "mp3": ["mp3", "mp4"],
                      "binary": ["dat", "bin"], 
                      "flash": ["swf", "fla", "as"],
                      "image": ["gif", "jpg", "jpeg", "png", "bmp"],
                      "office": ["doc", "xls", "ppt"], 
                      "pdf": ["pdf"],
                      "text": ["c", "cpp", "cc"],
                      "zip": ["tar", "zip", "gz", "tar.gz", "rar", "7z", "bz"],
                      "book": ["chm"], 
                      "torrent": ["bt", "torrent"],
                      "font": ["ttf", "font", "fon"] 
                    };
	for(k in filetypes) {
        console.log(type)
		if(filetypes[k].find(item => item === type) != undefined) {
			return k;
		}
	}
	return 'unknown';
}
function humanSize(bytes) {
    if (bytes === 0) return 'n/a'
  
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024))
  
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }
function rowGenerate(aid, pid, desturl, filetype, orgfilename, filesize) {
    let fileUploadForm = uploadFormIframe.contentWindow.document.getElementById("file_upload_form_0")
    let tbodyOfForm = fileUploadForm.getElementsByTagName("tbody")[0]
    console.log(tbodyOfForm)
    let uploadedFileHref = document.createElement("a")
    console.log(desturl)
    uploadedFileHref.href = desturl
    uploadedFileHref.target = "_blank"
    console.log(uploadedFileHref)
    let uploadedFileHrefIcon = document.createElement("img")
    uploadedFileHrefIcon.src = "/view/image/filetype/"+attach_file_type(filetype)+".gif"
    let uploadedFileHrefName = document.createElement("span")
    uploadedFileHrefName.className = "filename"
    uploadedFileHrefName.innerText = orgfilename
    uploadedFileHref.appendChild(uploadedFileHrefIcon)
    uploadedFileHref.appendChild(uploadedFileHrefName)
    let col1 = document.createElement("td")
    col1.appendChild(uploadedFileHref)
    let col2 = document.createElement("td")
    col2.innerText = humanSize(filesize)
    let progress = document.createElement("span")
    progress.className = "progress"
    progress.style = "width: 100px;"
    let progressInner = document.createElement("span")
    progressInner.style = "width: 100px;"
    progress.appendChild(progressInner)
    let col3 = document.createElement("td")
    col3.appendChild(progress)
    let finishFlag = document.createElement("span")
    finishFlag.className = "complete ok"
    finishFlag.innerText = "完成"
    col3.appendChild(finishFlag)
    let col4 = document.createElement("td")
    let col5 = document.createElement("td")
    let deleteSpan = document.createElement("span")
    deleteSpan.className = "delete"
    deleteSpan.style = "cursor: pointer; display: inline;"
    deleteSpan.title = "删除文件"
    deleteSpan.innerText = "删除"
    col5.appendChild(deleteSpan)
    let row1 = document.createElement("tr")
    row1.setAttribute("aid", aid)
    row1.setAttribute("pid", pid)
    row1.appendChild(col1)
    row1.appendChild(col2)
    row1.appendChild(col3)
    row1.appendChild(col4)
    row1.appendChild(col5)
    tbodyOfForm.appendChild(row1)
    let hr = document.createElement("tr")
    hr.innerHTML = '<td colspan="5"><hr></td>'
    tbodyOfForm.appendChild(hr)
}
async function uploadFile() {
    console.log('uploadFile')
    if (this.files && this.files.length > 0) {
        let newUploadInputLoading = uploadFormIframe.contentWindow.document.getElementById("newUploadInputLoading")
        let newUploadButton = uploadFormIframe.contentWindow.document.getElementById("newUploadButton")
        newUploadInputLoading.style = ""
        newUploadButton.style = "display:none"
        for (let fileItem of this.files) {
            console.log((fileItem.size / (1024*1024)).toFixed(2))
            if ((fileItem.size / (1024*1024)).toFixed(2) > 50) {
                alert('您选择的文件'+fileItem.name+'大小为'+humanSize(fileItem.size)+'，超出了服务器端允许的最大值:50M')
                continue
            }
            var myHeaders = new Headers();
            myHeaders.append("authority", window.location.hostname);
            myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"21\", \" Not;A Brand\";v=\"99\"");
            myHeaders.append("sec-ch-ua-mobile", "?0");
            myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");
            myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
            myHeaders.append("accept", "*/*");
            myHeaders.append("origin", "null");
            myHeaders.append("x-requested-with", "ShockwaveFlash/34.0.0.277");
            myHeaders.append("sec-fetch-site", "cross-site");
            myHeaders.append("sec-fetch-mode", "no-cors");
            myHeaders.append("sec-fetch-dest", "embed");
            myHeaders.append("referer", uploadFormIframe.src);
            myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
            let bbsLastday = document.cookie.split("; ").find((row) => row.startsWith("bbs_lastday"))
            let bbsLastonlineupdate = document.cookie.split("; ").find((row) => row.startsWith("bbs_lastonlineupdate"))
            let bbsSid = document.cookie.split("; ").find((row) => row.startsWith("bbs_sid"))
            myHeaders.append("Cookie", bbsLastday + "; " + bbsLastonlineupdate + "; " + bbsSid);

            var formdata = new FormData();
            formdata.append("Filename", fileItem.name);
            formdata.append("Filedata", fileItem);
            formdata.append("Upload", "Submit Query");

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
            };

            await fetch(window.location.origin + paramUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                let message = result.message
                console.log(message)
                rowGenerate(message.aid,message.pid,message.desturl,message.filetype,message.orgfilename,message.filesize)
            })
            .catch(error => console.log('error', error));
        }
        newUploadInputLoading.style = "display:none"
        newUploadButton.style = "width:1.5rem;height:22px;cursor: pointer;"
        let fileInput = uploadFormIframe.contentWindow.document.getElementById("newUploadInput")
        fileInput.value = ""
    }
}
function findUploadButton() {
    uploadFormIframe = document.getElementById("edui73_iframe")
    let uploadFormIframeContent = uploadFormIframe.contentWindow.document
    let uploadFlashButton = uploadFormIframeContent.getElementsByTagName("object")
    let body = uploadFormIframeContent.getElementsByTagName("body")[0]
    let linkrel = document.createElement("link")
    linkrel.rel = "stylesheet"
    linkrel.href = browser.runtime.getURL("btbtt.css")
    body.appendChild(linkrel)
    console.log("findUploadButton")
    if (uploadFlashButton.length > 0) {
        clearInterval(findUploadButtonIntervalID)
        console.log(uploadFlashButton)
        paramUrl = (decodeURIComponent(uploadFlashButton[0].childNodes[5].value.split("&").find(item => item.startsWith("uploadURL")))).replace("uploadURL=", "")
        console.log(paramUrl)
        let loading = uploadFlashButton[0].parentNode.appendChild(document.createElement("div"))
        loading.className = "spinner-border spinner-border-sm"
        loading.style = "display:none"
        loading.id = "newUploadInputLoading"
        let newUploadInput = uploadFlashButton[0].parentNode.appendChild(document.createElement("input"))
        newUploadInput.type = "file";
        newUploadInput.accept = "*";
        newUploadInput.id = "newUploadInput";
        newUploadInput.hidden = true;
        newUploadInput.multiple = true;
        newUploadInput.addEventListener('change', uploadFile)
        let newUploadButton = uploadFlashButton[0].parentNode.appendChild(document.createElement("img"))
        uploadFlashButton[0].remove()
        newUploadButton.style = "width:1.5rem;height:22px;cursor: pointer;"
        newUploadButton.src = browser.runtime.getURL("img/cloud-arrow-up-fill.svg")
        newUploadButton.id = "newUploadButton"
        newUploadButton.addEventListener('click', () => {
            console.log('clcik')
            uploadFormIframeContent.getElementById("newUploadInput").click()
        })
    }
}
function findAttachButton() {
    let divs = document.getElementsByTagName("div")
    for (let div of divs) {
        if (div.id === "edui77_body") {
            clearInterval(findAttachButtonIntervalID)
            findAttachButtonIntervalID = null
            div.addEventListener('click', () => {
                findUploadButtonIntervalID = setInterval(findUploadButton, 1000)
            })
        }
    }
}
function generateUploadButton() {
    let links = document.getElementsByTagName("a")
    for (let link of links) {
        if (link.id === "create_thread") {
            link.addEventListener('click', () => {
                findAttachButtonIntervalID = setInterval(findAttachButton, 1000)
            })
        }
    }
}
var findAttachButtonIntervalID = null
var findUploadButtonIntervalID = null
var uploadFormIframe = null
var paramUrl = null
generateUploadButton()