var English = {
    status: false,
    /* 下方控制台的按钮 */
    consoles: {
        copy: "copy",
        consoleTabName: "Console",
        outsave: "open Outsave",
        predict: "open Predict",
        umap: "open umap"
    },
    panel: {
        /* 上方菜单的按钮名 */
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
            /* 弹出框右下角的确定和取消 */
            footer: {
                confirm: "confirm",
                cancel: "cancel"
            },
            /* 上传TXT的弹出框的label */
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
            /* 上传自定义模型的弹出框的label */
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
            /* 矩阵弹出框的label */
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
            /* 标签弹出框的label */
            tag: {
                title: "tag",
                tip: "connect with",
                name: "tag name"
            },
            /* 预测弹出框的label */
            predict: {
                title: "predict",
                file_upload: "upload"
            },
            /* layerUMAP弹出框的label */
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
            // 当没有layerUMAP节点点击上传layerUMAP时
            layer: "未发现layer",
            // 当有多个layerUMAP节点点击上传layerUMAP时
            layer_: "多个layer",
            // 添加实验没有输入实验名时的提示
            addTabTitle: "错误",
            addTab: "未输入新tab name",
            // 保存实验的提示
            saveTab: "未保存流程，是否保存？",
            // 删除线时的提示
            deleteLine: "确定删除所点击的线吗?",
            // 删除点时的提示
            deleteNode: "确定要删除节点",
            // 连线不正确时的提示
            connectError: {
                self: "不能连接自己",
                repeat: "不能重复连线",
                circle: "不能回环",
                control: "不满足逻辑",
                limitMat: "Data Table和矩阵只能被一个其他节点连接",
                success: "连接成功"
            }
        }
    },
    /* 节点列表 */
    tool: {
        /* 父节点 */
        f_name: {
            upload_file: "shangchuanwenjian",
            data_change: "shujuzhuanhuan",
            mat_build: "juzhenpingjie",
            tab_list: " shiyanliebiao"
        },
        /* 子节点 */
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
        },
        alertTxt: {
            //点击删除实验的提示
            deleteProject: "是否删除" // + 实验名
        }
    }
}

export function get_English() {
    return English;
}