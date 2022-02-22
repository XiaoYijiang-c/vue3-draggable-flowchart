var data_B = {
    nodeList: [{
        ico: "el-icon-time",
        id: "node1",
        left: "131px",
        name: "2.csv",
        show: true,
        top: "34px",
        type: "txt",
        wid: 1,
    }, {
        ico: "el-icon-caret-right",
        id: "node2",
        left: "593px",
        name: "Data Table",
        show: true,
        top: "150px",
        type: "list",
        wid: 2,
    }],
    lineList: [{ from: 'node1', to: 'node2' }],
    windowList: [{
            id: "node1",
            wid: 1,
            type: "txt",
            nodeFormVisible: false,
            dataEncodingType: "oneHot",
            dataType: "DNA",
            input: "20",
            size: "20* 4",
            FILE: {
                file: {},
                fileName: "",
                fileContent: "",
            },
        },
        {
            id: "node2",
            nodeFormVisible: false,
            type: "list",
            wid: 2,
            showData: null
        }
    ],
    index: 3,
}

export function getDataB() {
    return data_B
}