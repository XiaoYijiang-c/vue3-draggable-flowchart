var chinese = {
    status: true,
    consoles: {

    },
    node: {},
    panel: {
        top_meun: {
            upload: "上传流程",
            clear: "清空",
            add_console: "添加控制台",
            add_tab: "添加实验",
            save: "保存当前实验",
            switch_lan: "switch",
            delete_tab: "删除当前实验"
        },
        window: {
            footer: {
                confirm: "确 定",
                cancel: "取 消"
            },
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

            }
        }
    },
    tool: {
        f_name: {
            upload_file: "上传文件",
            data_change: "数据转换",
            mat_build: "矩阵拼接",
            tab_list: " 实验列表"
        },
        c_name: {
            txt: "上传纯序列文件",
            csv: "上传csv文件",
            zdy: "上传自定义模型",
            list: "Data Table",
            mat: "矩阵",
            col: "列拼接",
            row: "行拼接"
        }
    }
}

export function get_chinese() {
    return chinese;
}