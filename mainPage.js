function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

async function getInfo(title, fullTitle, nodeTable) {
    await fetch("https://www.douban.com/search?cat=1002&q=" + title, {
        referrerPolicy: "no-referrer" // no Referer header
    }).then(r => {
        return r.text()
    }).then((rtext) => {
        var parser = new DOMParser();

        // Parse the text
        var doubandoc = parser.parseFromString(rtext, "text/html");
        if (doubandoc.getElementsByClassName("nbg").length > 0) {
            let picUrl = doubandoc.getElementsByClassName("nbg")[0].getElementsByTagName('img')[0].src
            console.log(picUrl)
            fetch(picUrl, {
                referrerPolicy: "no-referrer" // no Referer header
            }).then(img => {
                return img.blob()
            })
                .then(imgBlob => {
                    console.log(imgBlob)
                    let imgUrl = URL.createObjectURL(imgBlob)
                    let div = document.createElement("div")
                    div.style = "width: 18rem;"
                    div.className = "card"
                    nodeTable.replaceWith(div)
                    nodeTable = div
                    nodeTable.innerHTML = '<img src="' + imgUrl + '" class="card-img-top" alt="...">' +
                        '<div class="card-body">' +
                        '<h5 class="card-title">' + fullTitle + '</h5>' +
                        '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card</p>' +
                        '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                        '</div>'
                    let cardGroup = document.getElementsByClassName("card-group")
                    for (let i = 0; i < cardGroup.length; i++) {
                        console.log(cardGroup[i])
                        if (cardGroup[i].getElementsByClassName("notfinish").length > 0) {
                            console.log("notfinish")
                            let cardNotFinished = cardGroup[i].getElementsByClassName("notfinish")[0]
                            console.log(cardNotFinished)
                            let img = cardNotFinished.getElementsByTagName("img")[0]
                            img.src = imgUrl
                            let cardTitle = cardNotFinished.getElementsByTagName("h5")[0]
                            cardTitle.innerHTML = fullTitle
                            cardNotFinished.className = "card"
                            break
                        }
                    }
                })
        } else {
            let div = document.createElement("div")
            div.style = "width: 18rem;"
            div.className = "card"
            nodeTable.replaceWith(div)
            nodeTable = div
            nodeTable.innerHTML = '<img src="" class="card-img-top" alt="...">' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + fullTitle + '</h5>' +
                '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card</p>' +
                '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                '</div>'
            for (let i = 0; i < cardGroup.length; i++) {
                if (cardGroup[i].childNodes.length < 5) {
                    cardGroup[i].appendChild(nodeTable.cloneNode(true))
                    break
                }
            }
        }
    })
}

function setout(dramaTitle, fullTitle, nodesTable, i) {
    setTimeout(() => {
        getInfo(dramaTitle, fullTitle, nodesTable)
    }, i * 1000)
}

function generateCards() {
    let currentPath = window.location.pathname;
    if (currentPath.search("forum-index-fid-950") !== -1) {
        console.log("currentPath is drama")
        let nav = document.getElementById('nav')
        let widthControlTag = nav.parentNode
        widthControlTag.className = ""
        widthControlTag.style = "width:80%; top:0;bottom: 0;left: 0;right: 0;margin: auto;"
        let bg2 = document.getElementsByClassName("bg2")
        let nodesNeedRemove = []
        let nodesTable = []
        if (bg2.length > 0) {
            bg2Single = bg2[0]
            let nextSib = bg2Single.nextSibling
            while (nextSib !== null) {
                if (nextSib.nodeName === "TABLE") {
                    nodesTable.push(nextSib)
                } else {
                    nodesNeedRemove.push(nextSib)
                }
                nextSib = nextSib.nextSibling
            }
        }
        for (let i = 0; i < nodesNeedRemove.length; i++) {
            nodesNeedRemove[i].remove()
        }
        for (let i = 0; i < nodesTable.length; i++) {
            if (i % 5 === 0) {
                let newNode = document.createElement("div")
                newNode.className = "card-group"
                bg2Single.parentNode.insertBefore(newNode, bg2Single.nextSibling)
                newNode.innerHTML = '<div class="card notfinish" style="width: 18rem;">' +
                    '<img src="..." class="card-img-top" alt="...">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title">Card title</h5>' +
                    '<p class="card-text">Some quick example text to build on the card title and make up the bulk of th</p>' +
                    '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                    '</div>' +
                    '</div>' + '<div class="card  notfinish" style="width: 18rem;">' +
                    '<img src="..." class="card-img-top" alt="...">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title">Card title</h5>' +
                    '<p class="card-text">Some quick example text to build on the card title and make up the bulk of th</p>' +
                    '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                    '</div>' +
                    '</div>' + '<div class="card  notfinish" style="width: 18rem;">' +
                    '<img src="..." class="card-img-top" alt="...">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title">Card title</h5>' +
                    '<p class="card-text">Some quick example text to build on the card title and make up the bulk of th</p>' +
                    '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                    '</div>' +
                    '</div>' + '<div class="card  notfinish" style="width: 18rem;">' +
                    '<img src="..." class="card-img-top" alt="...">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title">Card title</h5>' +
                    '<p class="card-text">Some quick example text to build on the card title and make up the bulk of th</p>' +
                    '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                    '</div>' +
                    '</div>' + '<div class="card  notfinish" style="width: 18rem;">' +
                    '<img src="..." class="card-img-top" alt="...">' +
                    '<div class="card-body">' +
                    '<h5 class="card-title">Card title</h5>' +
                    '<p class="card-text">Some quick example text to build on the card title and make up the bulk of th</p>' +
                    '<a href="#" class="btn btn-primary">Go somewhere</a>' +
                    '</div>' +
                    '</div>'
            }
        }
        for (let i = 0;i < nodesTable.length;i++) {
            let originalContent = nodesTable[i]
            // nodesTable[i].replaceWith(div)
            // nodesTable[i] = div
            let subjectHrefs = originalContent.getElementsByClassName("subject_link")
            let fullTitle = ""
            for(let i = 0;i < subjectHrefs.length;i++) {
                fullTitle = subjectHrefs[i].title
            }
            let discribeContent = ""
            dramaTitle = fullTitle.split(/\[|\]/)[3]
            setout(dramaTitle, fullTitle, nodesTable[i], i)
        }
        for (let i = 0; i < nodesTable.length; i++) {
            nodesTable[i].remove()
        }
    }
}

function changeNav() {
    let menu = document.getElementById("menu")
    let menu2 = document.createElement("div")
    menu2.style = ""
    menu2.innerHTML = '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">' +
    '<div class="container-fluid" style="width:80%">' +
      '<a class="navbar-brand" href="#">BT btt</a>' +
      '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
        '<span class="navbar-toggler-icon"></span>' +
      '</button>' +
      '<div class="collapse navbar-collapse" id="navbarSupportedContent">' +
        '<ul class="navbar-nav me-auto mb-2 mb-lg-0">' +
        '</ul>' +
        '<form class="d-flex">' +
          '<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">' +
          '<button class="btn btn-outline-success" type="submit">Search</button>' +
        '</form>' +
      '</div>' +
    '</div>' +
  '</nav>'
  menu.replaceWith(menu2)
  menu = menu2
  menuUl = menu.getElementsByTagName("ul")[0]
  menuUl.innerHTML = '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="./">首页</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-975.htm">交流</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-951.htm">电影</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-950.htm">剧集</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-1183.htm">高清电影</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-953.htm">音乐</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-981.htm">动漫</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-955.htm">游戏</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-1106.htm">综艺</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-1151.htm">图书</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-957.htm">美图</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-952.htm">科技</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-1187.htm">求助</a>' +
  '</li>' +
  '<li class="nav-item">'+
  '<a class="nav-link active" aria-current="page" href="forum-index-fid-1191.htm">音轨字幕</a>' +
  '</li>'
}
changeNav();
// generateCards();