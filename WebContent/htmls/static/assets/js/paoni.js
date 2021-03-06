﻿allPaoni = [];
var postData = {};
var coorDict = {};
var coorNum = 4;
function SetPaoniTable() {
	$("#toolbar").show();
	$("#btn_backup").hide();
	$("#btn_add").show();
	$("#btn_edit").show();
	$("#btn_delete").show();
	$("#btn_show").show();
	
	$("#mapBody").show();
	$("#data_clean").hide();
	$("#detail_information").hide();
	$("#monitor_search_modal").hide();
	$("#project_progress").hide();
	
    $.ajax({
            type: "GET",
            url: "/shanggang/dumping_area/list",
            success: function (data) {    
            	    console.log(data);
            	    fillAllPaoni(data);
            	    InitPaoniTable();
                  },       
            error: function () {       
                   alert("fail");       
              }       
        });
}

function RefreshLoadPaoni()
{
    $.ajax({
            type: "GET",
            url: "/shanggang/dumping_area/list",
            success: function (data) {    
            	    fillAllPaoni(data);
            	    RefreshPaoniTable();
                  },       
            error: function () {       
                   alert("fail");       
              }       
        });
}
function InitPaoniTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allPaoni,
    height:380,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'areaid',
        title: '抛泥区域编号'
    }, 
	{
        field: 'port',
        title: '抛泥区域名称'
    }
	]});
	$('#datatable').show();
	$("#btn_add").off('click');
	$("#btn_add").click(function () {
		var body = document.getElementById("paoni_update_body");
		while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
		{  
			body.removeChild(body.firstChild); 
		}
		$("#paoniquyu").val("");
		$("#paonigangqu").val("");
		coorNum = 1;
		var entry = "";
		entry += '<div id="pn'+coorNum+'" class="row" style="margin:0;height:13%;">';
		entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'经度</div>';
		entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidianx" id="paonidianx'+coorNum+'"style="width:145px;height:25px" /></div>';
		entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'纬度</div>';
		entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidiany" id="paonidiany'+coorNum+'"style="width:145px;height:25px" /></div></div>';
		$("#paoni_update_body").append(entry);
		document.getElementById("paoni_update_label").className = "modal-title glyphicon glyphicon-plus";
        $("#paoni_update_label").text("新增");
		$('#paoni_update').modal('show');
		$("#paoni_add_point_button").show();
		$("#paoni_delete_point_button").show();
		$('#paoni_add_button').show();
		$('#paoni_edit_button').hide();
		$('#paoni_delete_button').hide();
        });
	$("#btn_edit").off('click');
	$("#btn_edit").click(function () {
            var arrselections = $("#table").bootstrapTable('getSelections');
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
			area_id = arrselections[0].areaid;
			port = arrselections[0].port;
			$("#paoniquyu").val(area_id);
			$("#paonigangqu").val(port);
			var body = document.getElementById("paoni_update_body");
			while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
			{  
				body.removeChild(body.firstChild); 
			}
			var buttomPoint = coorDict[area_id];
			coorNum = buttomPoint.length;	
			var entry = "";
			for (var i = 1; i < coorNum + 1; i++) {
				entry += '<div id="pn'+i+'" class="row" style="margin:0;height:13%;">';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'经度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidianx" id="paonidianx'+i+'"style="width:145px;height:25px" /></div>';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'纬度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidiany" id="paonidiany'+i+'"style="width:145px;height:25px" /></div></div>';
			}
			$("#paoni_update_body").append(entry);
			for (var i = 1;i<coorNum + 1;++i){ 
				$('#paonidianx' + i).val(buttomPoint[i - 1].x)
				$('#paonidiany' + i).val(buttomPoint[i - 1].y)
			}
			document.getElementById("paoni_update_label").className = "modal-title glyphicon glyphicon-pencil";
            $("#paoni_update_label").text("编辑");
			$('#paoni_update').modal('show');
			$("#paoni_add_point_button").show();
			$("#paoni_delete_point_button").show();
			$('#paoni_add_button').hide();
			$('#paoni_edit_button').show();
			$('#paoni_delete_button').hide();
        });
	$("#btn_delete").off('click');
	$("#btn_delete").click(function () {
            var arrselections = $("#table").bootstrapTable('getSelections');
			console.log(arrselections);
            if (arrselections.length > 1) {
                return;
            }
            if (arrselections.length <= 0) {
                return;
            }
			area_id = arrselections[0].areaid;
			port = arrselections[0].port;
			if(confirm("确定要删除吗？")){
				paoni_delete(area_id);
			}
			
			/*$("#paoniquyu").val(area_id);
			$("#paonigangqu").val(port);
			var body = document.getElementById("paoni_update_body");
			while(body.hasChildNodes()) //当div下还存在子节点时 循环继续  
			{  
				body.removeChild(body.firstChild); 
			}
			var buttomPoint = coorDict[area_id];
			coorNum = buttomPoint.length;
			var entry = "";
			for (var i = 1; i < coorNum + 1; i++) {
				entry += '<div id="pn'+i+'" class="row" style="margin:0;height:13%;">';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'经度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidianx" id="paonidianx'+i+'"style="width:145px;height:25px" /></div>';
				entry += '<div class="col-sm-2 nopadding">坐标点'+i+'纬度</div>';
				entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidiany" id="paonidiany'+i+'"style="width:145px;height:25px" /></div></div>';
			}
			$("#paoni_update_body").append(entry);
			for (var i = 1;i<coorNum + 1;++i){ 
				$('#paonidianx' + i).val(buttomPoint[i - 1].x)
				$('#paonidiany' + i).val(buttomPoint[i - 1].y)
			}
            $("#paoni_update_label").text("编辑");
			$('#paoni_update').modal('show');
			$("#paoni_add_point_button").hide();
			$("#paoni_delete_point_button").hide();
			$('#paoni_add_button').hide();
			$('#paoni_edit_button').hide();
			$('#paoni_delete_button').show();*/
        });
	$("#btn_show").off('click');
	$("#btn_show").click(function () {
		var arrselections = $("#table").bootstrapTable('getSelections');
		console.log(arrselections);
		if (arrselections.length > 1) {
			return;
		}
		if (arrselections.length <= 0) {
			return;
		}
		area_id = arrselections[0].areaid;
		deleteButtomFace()
		labelInfo = [];
		AddButtomLayer();
		buttomFaces = 1000;
        var buttomPoint = coorDict[area_id];
        var coorNum = buttomPoint.length;
        API_SetMapViewCenter(convertToLatitu(buttomPoint[0].x)/10000000, convertToLatitu(buttomPoint[0].y)/10000000, 80000);
        for (var i = 0; i < coorNum; i++) {
            var ob = [];
            ob.push(convertToLatitu(buttomPoint[i].y));
            ob.push(convertToLatitu(buttomPoint[i].x));
            labelInfo.push(ob);
        }
        AddButtomFaces(labelInfo);
		$('html, body').animate({
        scrollTop: $("#mapBody").offset().top
		}, 100);
        });
}

function RefreshPaoniTable() {
	$('#datatable').hide();
	$('#table').bootstrapTable('load', allPaoni); 
	$('#datatable').show();
}

function fillAllPaoni(data) {
	allPaoni = [];
	for(var i = 0;i<data.length;++i)
	{
		if (data[i].area_id == "4_1" ||data[i].area_id == "5_1")
			continue;
		allPaoni.push({"areaid":data[i].area_id,"port":data[i].areaname});
		var locationstr = data[i].location;
		var point = locationstr.split("-");
		coor = [];
		for (var j = 0;j<point.length;++j)
		{	
		    var p = point[j].split(",");
		    coor.push({x:p[1],y:p[0]});
		}
		coorDict[data[i].area_id] = coor;
	}
}

function paoni_add()
{
	area_id = $("#paoniquyu").val();
	port = $("#paonigangqu").val();
    var locationstr = "";
    for (var i = 1; i < coorNum + 1; i++) {
        locationstr += $("#paonidiany" + i).val()+","+$("#paonidianx" + i).val()+"-"; 
    }
    locationstr = locationstr.substr(0,locationstr.length-1);
	postData = {"area_id":area_id,"location":locationstr,"areaname":port};
	$.ajax({
         type: "POST",
         url: "/shanggang/dumping_area/add",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $('#paoni_update').modal('hide');
         	 RefreshLoadPaoni();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
}

function paoni_edit()
{
	area_id = $("#paoniquyu").val();
	port = $("#paonigangqu").val();
    var locationstr = "";
    for (var i = 1; i < coorNum + 1; i++) {
        locationstr += $("#paonidiany" + i).val()+","+$("#paonidianx" + i).val()+"-"; 
    }
    locationstr = locationstr.substr(0,locationstr.length-1);
	postData = {"area_id":area_id,"location":locationstr,"areaname":port}; 
	$.ajax({
         type: "POST",
         url: "/shanggang/dumping_area/update",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $('#paoni_update').modal('hide');
         	 RefreshLoadPaoni();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
}

function paoni_delete(id)
{
	//area_id = $("#paoniquyu").val();
	area_id = id;
	postData = {"area_id":area_id}; 
	$.ajax({
         type: "POST",
         url: "/shanggang/dumping_area/delete",
         data: JSON.stringify(postData),
         contentType:"application/json",
         success: function (data) {    
        	 alert("success");
			 $('#paoni_update').modal('hide');
         	 RefreshLoadPaoni();
               },       
         error: function () {       
                alert("fail");       
           }       
     });
}

function paoni_add_button()
{
	coorNum++;
	var entry = "";
	entry += '<div id="pn'+coorNum+'" class="row" style="margin:0;height:13%;">';
	entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'经度</div>';
	entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidianx" id="paonidianx'+coorNum+'"style="width:145px;height:25px" /></div>';
	entry += '<div class="col-sm-2 nopadding">坐标点'+coorNum+'纬度</div>';
	entry += '<div class="col-sm-4 nopadding"><input type="text" name="paonidiany" id="paonidiany'+coorNum+'"style="width:145px;height:25px" /></div></div>';
	$("#paoni_update_body").append(entry);
}

function paoni_delete_button()
{
	if (coorNum>1)
	{
		var parent=document.getElementById("paoni_update_body");
		var childx=document.getElementById("pn" + coorNum);
		parent.removeChild(childx);
		coorNum--;
	}	
}

function choosechangjiang(){
    dashLineOn = 0;   
    times = [];
    datas = [];
    $(".change").removeClass('Current');
    $("#waigaoqiao1").addClass('Current');
    level = levels[0];
    warnlevel = warnlevels[0];
    chooseHarbor=1;
    API_SetMapViewCenter(122.23333, 30.56667, 80000);
    deleteFaces();
    getWarningLevel();
    //getDepthLevel();
    //getRecentDate();
    
    $("#paoni").show();
    $("#set-project-param").show();
    $("#boat-import").show();
    $("#boat-management").show();
    $("#set-sealine").show();
	$("#monitor").show();
	$("#data-manage").show();
	$("#dirt-error").show();
	$("#run-error").show();
	$("#speed-error").show();
	$("#weather-error").show();
	$("#process-error").show();
	$("#boat-stats").show();
	$("#fleet-stats").show();
	$("#port-stats").show();	
		
    $("#xianshi").click()
}