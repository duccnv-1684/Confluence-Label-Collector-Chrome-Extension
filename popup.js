const getContent = () => {
    let labels = ""
    labels += "<tr>" +
        "<td>" +
        "Label ID" +
        "</td>" +
        "<td>" +
        "Label VN" +
        "</td>" +
        "<td>" +
        "Label EN" +
        "</td>" +
        "</tr>"
    const tables = document.getElementsByTagName("table")
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i]
        const tHead = table.tHead
        const tBodies = table.tBodies
        if (tHead != null) {
            const tableHeader = table.tHead.rows
            const header = tableHeader[0]
            const titleElements = header.getElementsByTagName("th")
            const columnCount = titleElements.length
            let enIndex = -1;
            let vnIndex = -1;
            let idIndex = -1;
            for (let j = 0; j < columnCount; j++) {
                const element = titleElements[j]
                if (element.innerText === "Label VN") {
                    vnIndex = j
                }
                if (element.innerText === "Label EN") {
                    enIndex = j
                }
                if (element.innerText === "Label ID") {
                    idIndex = j
                }
            }
            if (enIndex >= 0 && vnIndex >= 0 && idIndex >= 0) {
                for (let j = 0; j < tBodies.length; j++) {
                    const body = tBodies[j];
                    const rows = body.getElementsByTagName("tr")
                    for (let k = 0; k < rows.length; k++) {
                        const row = rows[k]
                        const cells = row.getElementsByTagName("td")
                        const offset = columnCount - cells.length
                        if (enIndex - offset >= 0 && vnIndex - offset >= 0 && idIndex - offset >= 0) {
                            const enContent = cells[enIndex - offset].innerText.trim()
                            const vnContent = cells[vnIndex - offset].innerText.trim()
                            const id = cells[idIndex - offset].innerText.trim()
                            if (id.length > 0) {
                                labels += "<tr>" +
                                    "<td>" +
                                    id +
                                    "</td>" +
                                    "<td>" +
                                    vnContent +
                                    "</td>" +
                                    "<td>" +
                                    enContent +
                                    "</td>" +
                                    "</tr>"
                            }
                        }
                    }
                }
            }
        } else {
            const table = tBodies[0]
            const rows = table.getElementsByTagName("tr")
            const headerRow = rows[0]
            const headerCells = headerRow.getElementsByTagName("th")
            const columnCount = headerCells.length
            let enIndex = -1;
            let vnIndex = -1;
            let idIndex = -1;
            for (let j = 0; j < columnCount; j++) {
                const element = headerCells[j]
                if (element.innerText === "Label VN") {
                    vnIndex = j
                }
                if (element.innerText === "Label EN") {
                    enIndex = j
                }
                if (element.innerText === "Label ID") {
                    idIndex = j
                }
            }
            console.log(enIndex)
            console.log(vnIndex)
            console.log(idIndex)
            if (enIndex >= 0 && vnIndex >= 0 && idIndex >= 0) {
                for (let j = 1; j < rows.length; j++) {
                    const row = rows[j];
                    console.log(row)
                    const cells = row.getElementsByTagName("td")
                    const offset = columnCount - cells.length
                    if (enIndex - offset >= 0 && vnIndex - offset >= 0 && idIndex - offset >= 0) {
                        const enContent = cells[enIndex - offset].innerText.trim()
                        const vnContent = cells[vnIndex - offset].innerText.trim()
                        const id = cells[idIndex - offset].innerText.trim()
                        if (id.length > 0) {
                            labels += "<tr>" +
                                "<td>" +
                                id +
                                "</td>" +
                                "<td>" +
                                vnContent +
                                "</td>" +
                                "<td>" +
                                enContent +
                                "</td>" +
                                "</tr>"
                        }
                    }
                }
            }
        }
    }
    return labels;
}


chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: getContent
    }, (result) => {
        document.getElementById("content").innerHTML += result[0].result
        const copyVnAndroid = document.getElementById('vnAndroid');
        copyVnAndroid.addEventListener('click', copyVnForAndroid);

        const copyEnAndroid = document.getElementById('enAndroid');
        copyEnAndroid.addEventListener('click', copyEnForAndroid);

        const copyVnIOS = document.getElementById('vniOS');
        copyVnIOS.addEventListener('click', copyVnForIOS);

        const copyEnIOS = document.getElementById('eniOS');
        copyEnIOS.addEventListener('click', copyEnForIOS);
    });
});

function copyVnForAndroid() {
    parseResource(true, true);
}

function copyEnForAndroid() {
    parseResource(true, false);
}

function copyVnForIOS() {
    parseResource(false, true);
}


function copyEnForIOS() {
    parseResource(false, false);
}

function parseResource(isAndroid, isVn) {
    let resources = ""
    const content = document.getElementById("content")
    const rows = content.getElementsByTagName("tr")
    console.log(rows)
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td")
        let id
        if (isAndroid) {
            id = cells[0].innerText.trim().replaceAll(".", "_")
        } else {
            id = cells[0].innerText.trim().replaceAll("_", ".")
        }
        const vn = cells[1].innerText.trim()
        const en = cells[2].innerText.trim()
        let content
        if (isVn) {
            content = vn
        } else {
            content = en
        }
        let resource
        if (isAndroid) {
            resource = "<string name=\"" + id + "\">" + content + "</string>\n"
        } else {
            resource = ("\"" + id + "\"=\"" + content + "\";\n")
        }
        resources += resource
    }
    let message
    if (isAndroid) {
        if (isVn) {
            message = "Copied Android Vi"
        } else {
            message = "Copied Android En"
        }
    } else {
        if (isVn) {
            message = "Copied iOS Vi"
        } else {
            message = "Copied iOS En"
        }
    }
    navigator.clipboard.writeText(resources)
}
