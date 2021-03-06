
var PageShipStaffAdd = function(){
    return {
        defaultOption: {
            basePath:"",
            action : "",
            shipStaffForm : null
        },
        init :function ()
        {
            mini.parse();
            this.basePath = PageMain.basePath;
            this.shipStaffForm = new mini.Form("shipStaffFormAdd");
            mini.get("gender").setData([{id:1, name:"男"},{id:2, name:"女"}]);
            mini.get("title").setData([{id:1, name:"船长"},{id:2, name:"驾驶员"},{id:3, name:"轮机员"},{id:4, name:"水手"}]);
            mini.get("isOwner").setData([{id:1, name:"是"},{id:2, name:"否"}]);
            mini.get("status").setData([{id:1, name:"启用"},{id:2, name:"禁用"}]);

        },
        funSetData : function(data)
        {
            var row = data.row;
            this.action = data.action;
            mini.get("shipId").setData(row.shipIdFly)
            this.shipStaffForm.setData(row);
            if(this.action == "add")
            {
                mini.get("status").select(0)
            }
            if(this.action == "oper")
            {
                mini.get("layout_shipStaff_add").updateRegion("south", { visible: false });//$(".mini-toolbar").hide();
                var fields = this.shipStaffForm.getFields();
                for (var i = 0, l = fields.length; i < l; i++)
                {
                    var c = fields[i];
                    if (c.setReadOnly) c.setReadOnly(true);     //只读
                    if (c.setIsValid) c.setIsValid(true);      //去除错误提示
                }
            }
        },
        funSave : function()
        {
            this.shipStaffForm.validate();
            if (!this.shipStaffForm.isValid())
            {
                var errorTexts = form.getErrorTexts();
                for (var i in errorTexts)
                {
                    mini.alert(errorTexts[i]);
                    return;
                }
            }

            var me = this;
            var obj = this.shipStaffForm.getData(true);
            var flag = false;
            if(obj.title == "1"){
                $.ajax({
                    url : PageMain.defaultOption.httpUrl + "/shipStaff/judege?a="+Math.random(),
                    type : 'POST',
                    data : obj,
                    dataType: 'json',
                    async:false,
                    success: function (data)
                    {
                        if(data.data > 0){
                            PageMain.funShowMessageBox("该船舶已有船长，请重新添加！");
                        }else {
                            flag=true;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        PageMain.funShowMessageBox("操作出现异常");
                    }
                });
            } else {
                flag =true;
            }
            if(flag){
                $.ajax({
                    url : PageMain.defaultOption.httpUrl + "/shipStaff/" + me.action + "?a="+Math.random(),
                    type : 'POST',
                    data : obj,
                    dataType: 'json',
                    success: function (data)
                    {
                        if (data.success)
                        {
                            mini.alert("操作成功", "提醒", function(){
                                if(data.success)
                                {
                                    PageMain.funCloseWindow("save");
                                }
                            });
                        }
                        else
                        {
                            PageMain.funShowMessageBox(data.msg);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        PageMain.funShowMessageBox("操作出现异常");
                    }
                });
            }
        },
        funCancel : function()
        {
            PageMain.funCloseWindow("cancel");
        },
        funSetOther:function () {
            var ideVal = mini.get("identity").getValue();

            if(ideVal.length ==15){

            } else if(ideVal.length ==18 ){
                var year = ideVal.substring(6,10);
                var month = ideVal.substring(10,12);
                var day =ideVal.substring(12,14);
                mini.get("birthday").setValue(year+"-"+month+"-"+day);
            }
            var curDate = new Date();
            var curYear = curDate.getFullYear();
            mini.get("age").setValue(curYear-year);

            var sex = ideVal.substring(16,17);
            if( sex % 2 == 0){
                mini.get("gender").setValue("2");
            } else {
                mini.get("gender").setValue("1");
            }
        }

    }
}();

$(function(){
    PageShipStaffAdd.init();
});