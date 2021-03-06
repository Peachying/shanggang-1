﻿allBlackList = [];
postData = {};

function InitBlackList()
{
	$('#data_clean').hide();
	$('#mapBody').hide();
	$("#monitor_search_modal").hide();
	$('#toolbar').hide();
	fillBlackListData();
	InitBlackListTable();
}

function InitBlackListTable()
{
	$('#datatable').hide();
	$('#table').bootstrapTable('destroy');
    $('#table').bootstrapTable({
    data: allBlackList,
    height:380,
	pagination: true,
    pageSize: 5,
	clickToSelect: true,
	singleSelect:true,

    columns: [
	{checkbox: true},
	{
        field: 'mmsi',
        title: 'MMSI'
    }, 
	{
        field: 'speed',
        title: '超速次数'
    }, 
	{
        field: 'area',
        title: '经抛泥异常次数'
    }, 
	{
        field: 'route',
        title: '航线异常次数'
    },
	{
        field: 'all',
        title: '总异常次数',
		sortable : true
    }
	]});
    $('#datatable').show();
}

function fillBlackListData()
{
	tmp = {};
	for(var x in speedfre)
	{
		if(x in tmp)
		{
			tmp[x]["speed"] = speedfre[x];
		}
		else
		{
			tmp[x] = {"speed":0,"area":0,"route":0,"mmsi":x};
			tmp[x]["speed"] = speedfre[x];
		}
	}
	for(var x in areafre)
	{
		if(x in tmp)
		{
			tmp[x]["area"] = areafre[x];
		}
		else
		{
			tmp[x] = {"speed":0,"area":0,"route":0,"mmsi":x};
			tmp[x]["area"] = areafre[x];
		}
	}
	for(var x in routefre)
	{
		if(x in tmp)
		{
			tmp[x]["route"] = routefre[x];
		}
		else
		{
			tmp[x] = {"speed":0,"area":0,"route":0,"mmsi":x};
			tmp[x]["route"] = routefre[x];
		}
	}
	for(var x in tmp)
	{
		var a = tmp[x];
		a["all"] = tmp[x].area + tmp[x].speed + tmp[x].route;
		allBlackList.push(a);
	}
}