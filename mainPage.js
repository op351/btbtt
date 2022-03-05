function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
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
        if (bg2.length > 0)  {
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
        for (let i = 0;i < nodesNeedRemove.length;i++) {
            nodesNeedRemove[i].remove()
        }
        for (let i = 0;i < nodesTable.length;i++) {
            let div = document.createElement("div")
            div.style = "display: inline-block;"
            let originalContent = nodesTable[i]
            nodesTable[i].replaceWith(div)
            nodesTable[i] = div
            let subjectHrefs = originalContent.getElementsByClassName("subject_link")
            let fullTitle = ""
            for(let i = 0;i < subjectHrefs.length;i++) {
                fullTitle = subjectHrefs[i].title
            }
            nodesTable[i].innerHTML = '<div class="card" style="width: 18rem;">'+
            '<img src="..." class="card-img-top" alt="...">'+
            '<div class="card-body">'+
            '<h5 class="card-title">'+ fullTitle +'</h5>'+
            '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card</p>'+
            '<a href="#" class="btn btn-primary">Go somewhere</a>'+
            '</div>'+
            '</div>'
        }
    }
}

generateCards();