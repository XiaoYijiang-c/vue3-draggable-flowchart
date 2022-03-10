var English = {
    status: false,
    consoles: {
        copy: "copy"
    },
    node: {},
    panel: {
        top_meun: {
            upload: "shangchuanliucheng",
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
            list: "Data Table",
            tag: "tag",
            train: "train",
            test: "test",
            mat: "juzhen",
            col: "liepingjie",
            row: "hangpingjie"
        }
    }
}

export function get_English() {
    return English;
}