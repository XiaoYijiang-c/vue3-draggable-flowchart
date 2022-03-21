var English = {
    status: false,
    consoles: {
        copy: "copy",
        consoleTabName: "Console",
        outsave: "open Outsave",
        predict: "open Predict",
        umap: "open umap"
    },
    node: {},
    panel: {
        top_meun: {
            upload: "shangchuanliucheng",
            upload_layer: "uploadlayer",
            predict: "uploadpredict",
            clear: "qingkong",
            add_console: "tianjiakongzhitai",
            add_tab: "tianjiashiyan",
            save: "baocundangqianshiyan",
            switch_lan: "切换",
            delete_tab: "delete"
        },
        window: {
            footer: {
                confirm: "confirm",
                cancel: "cancel"
            },
            tc: {
                title: "shangchuanwenjian",
                protein: "protein",
                placeholder: "qingshuruneirong",
                data_type: "shujuleixing",
                data_enc_type: "bianmaleixing",
                Spclen: "Spclen",
                mat_size: "juzhenweidu",
                file_upload: "wenjianshangchuan"
            },
            zdy: {
                title: "shangchuanzidingyimoxing",
                file_type: "wenjianleixing",
                file_type_value1: ".py moxingwenjianshangchuan",
                file_type_value2: ".json moxingwenjianshangchuan",
                file_type_value3: "xuanzequanzhongwenjian",
                file_type_value4: "buxuanzequanzhongwenjian",
                file_upload: "wenjianshangchuan",
                file_upload_value: "quanzhongwenjianshangchuan",
                check_model: "jianchamoxing"
            },
            mat: {
                title: "juzhen",
                mat_handle: "juzhenchuli",
                mat_handle_value1: {
                    value1: "biaozhunhua",
                    value2: "hangbiaozhunhua",
                    value3: "liebiaozhunhua",
                },
                mat_handle_value2: {
                    value1: "guiyihua",
                    value2: "hangguiyihua",
                    value3: "lieguiyihua",
                },
                mat_handle_value3: "bujinxinchuli",
                mat_handle_value4: "guiyiqujian",

            },
            tag: {
                title: "tag",
                tip: "connect with",
                name: "tag name"
            },
            predict: {
                title: "predict",
                file_upload: "upload"
            },
            color: {
                title: "layerUMAP",
                isgrid: "isgrid",
                grid_n_neighbors: "grid_n_neighbors",
                grid_min_dist: "grid_min_dist",
                n_neighbors: "n_neighbors",
                min_dist: "min_dist",
                figWidth: "figWidth",
                figHeight: "figHeight",
                metric: "metric",
                istheme: "istheme",
                layerIndexHas: "layerIndexHas",
                layerIndex: "layerIndex",
                theme: "theme",
                color_key_cmap: "color_key_cmap",
                background: "background",
                dimensionReduceMethod: "dimension",
            }
        },
        alertTxt: {
            layer: "canno found layer",
            layer_: "多个layer",
            addTabTitle: "错误",
            addTab: "未输入新tab name",
            saveTab: "未保存流程，是否保存？",
            deleteLine: "确定删除所点击的线吗?",
            deleteNode: "确定要删除节点",
            connectError: {
                self: "self",
                repeat: "repeat",
                circle: "不能回环",
                control: "不满足逻辑",
                limitMat: "Data Table和矩阵只能被一个其他节点连接",
                success: "连接成功"
            }
        }
    },
    tool: {
        f_name: {
            upload_file: "shangchuanwenjian",
            data_change: "shujuzhuanhuan",
            mat_build: "juzhenpingjie",
            tab_list: " shiyanliebiao"
        },
        c_name: {
            txt: "shagnchuanchunxuliewenjian",
            csv: "shangchuan csv wenjian",
            zdy: "shagnchuanzidingyimoxing",
            predict: "predict",
            list: "Data Table",
            tag: "tag",
            train: "train",
            test: "test",
            color: "layer",
            mat: "juzhen",
            col: "liepingjie",
            row: "hangpingjie"
        }
    }
}

export function get_English() {
    return English;
}