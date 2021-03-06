var chinese = {
    status: true,
    /* 下方控制台的按钮 */
    consoles: {
        copy: "复制",
        consoleTabName: "Console",
        outsave: "打开Outsave",
        predict: "打开Predict",
        umap: "打开umap"
    },
    panel: {
        /* 上方菜单的按钮名 */
        top_meun: {
            upload: "上传流程",
            upload_layer: "上传layer",
            predict: "上传预测",
            clear: "清空",
            add_console: "添加控制台",
            add_tab: "添加实验",
            save: "保存当前实验",
            switch_lan: "switch",
            delete_tab: "删除当前实验"
        },
        window: {
            /* 弹出框右下角的确定和取消 */
            footer: {
                confirm: "确 定",
                cancel: "取 消"
            },
            /* 上传TXT的弹出框的label */
            tc: {
                title: "上传文件",
                protein: "蛋白质",
                placeholder: "请输入内容",
                data_type: "数据类型",
                data_enc_type: "编码类型",
                Spclen: "Spclen",
                mat_size: "矩阵维度",
                file_upload: "文件上传"
            },
            /* 上传自定义模型的弹出框的label */
            zdy: {
                title: "上传自定义模型",
                file_type: "文件类型",
                file_type_value1: ".py模型文件上传",
                file_type_value2: ".json模型文件上传",
                file_type_value3: "选择权重文件",
                file_type_value4: "不选择权重文件",
                file_upload: "文件上传",
                file_upload_value: "权重文件上传",
                check_model: "检查模型"
            },
            /* 矩阵弹出框的label */
            mat: {
                title: "矩 阵",
                mat_handle: "矩阵处理",
                mat_handle_value1: {
                    value1: "标准化",
                    value2: "行标准化",
                    value3: "列标准化",
                },
                mat_handle_value2: {
                    value1: "归一化",
                    value2: "行归一化",
                    value3: "列归一化",
                },
                mat_handle_value3: "不进行处理",
                mat_handle_value4: "归一区间",

            },
            /* 标签弹出框的label */
            tag: {
                title: "标签",
                tip: "连接矩阵:",
                name: "标签名"
            },
            /* 预测弹出框的label */
            predict: {
                title: "上传预测文件",
                file_upload: "文件上传"
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
            upload_file: "上传文件",
            data_change: "数据转换",
            mat_build: "矩阵拼接",
            tab_list: " 实验列表",

        },
        /* 子节点 */
        c_name: {
            txt: "上传纯序列文件",
            csv: "上传csv文件",
            zdy: "上传自定义模型",
            predict: "上传预测文件",
            list: "Data Table",
            mat: "矩阵",
            tag: "标签",
            train: "训练",
            test: "测试",
            color: "layer",
            col: "列拼接",
            row: "行拼接"
        },
        alertTxt: {
            //点击删除实验的提示
            deleteProject: "是否删除" // + 实验名
        }
    },

}

export function get_chinese() {
    return chinese;
}