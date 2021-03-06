/*
	select-filters.js v0.9 **http://select-filters.projet.cc
	jQuery plugin that allow you to link a text input with a select tag, and use the input to filter options

	Copyright (c) 2014 Ezzayer Amine **http://www.ezzayer.me
	MIT license **https://raw.github.com/ezz-amine/select-filters/master/LICENSE

 */
$.fn.selectFilters = function(opt,p,v){
	if($(this).length > 1){
		$(this).each(function(){
			$(this).selectFilters(opt,p,v);
		});
		return false;
	}
	var fi = $(this[0]);
	var target = null;
	var initDefaultparam = {
		min:3,
		on:"keyup", //keyup, keydown, change
		multipleWord:{
			active: false,
			method  : "and" // "and" or "or"
		},
		accentFolding: true
	};
	var defaultParam = null;
	check(
		functionCheck(opt,p,v),
		init
	);
	function check(opt,callback){
		if(!fi.is("input:text")){
			console.log("$.selectFilters work only with text input.");
			return false;
		}
		target = fi.data("target");
		if(typeof target === "undefined"){
			console.log("$.selectFilters need a data-target attribut pointing to a select tag.");
			return false;
		}
		target = $(target);
		if(!target.is("select")){
			console.log("$.selectFilters need a select tag, a none select tag giving.");
			return false;
		}
		if(opt !== false) optCheck(opt);
		callback();
	}
	function init(){
		param= fi.data("param");
		target.find("option").each(function(){
			opt = $(this);
			val = opt.text().trim();
			opt.attr("data-value",val);
		});
		fi.data("options",target.find("option"));
		fi.data("filtered",false);
		fi.on(param.on,event_triggered);
	}
	function functionCheck(opt,p,v){
		if(typeof opt === "string"){
			if(opt == "option") return option(p,v);
			if(opt == "reload") return reload();
		}
		return fi.data("param");
	}
	function optCheck(opt){
		defaultParam = $.extend({},initDefaultparam);
		opt = typeof opt === "undefined" ? {}  : opt;
		if(fi.data("selectMin") != null) defaultParam.min = fi.data("selectMin");
		if(fi.data("selectOn") != null) defaultParam.on = fi.data("selectOn");
		if(fi.data("selectMultipleWordActive") != null) defaultParam.multipleWord.active = fi.data("selectMultipleWordActive");
		if(fi.data("selectMultipleWordMethod") != null) defaultParam.multipleWord.method = fi.data("selectMultipleWordMethod");
		if(fi.data("selectAccentFolding") != null) defaultParam.accentFolding = fi.data("selectAccentFolding");
		defaultParam = $.extend(defaultParam,opt);
		fi.data("param",defaultParam);
	}
	function option(p,v){
		if(typeof p !== "undefined"){
			param= fi.data("param");
			if(typeof v === "undefined"){
				return param['p'];
			}else{
				param['p'] = v;
			}
		}
		return fi.data("param");
	}
	function reload(){
		check(false,function(){
			target.find("option:not([data-value])").each(function(){
				opt = $(this);
				val = opt.text().trim();
				opt.attr("data-value",val);
			});
			fi.data("options",target.find("option"));
		});
		return fi.data("param");
	}
	function reload(){
		check(false,function(){
			target.find("option:not([data-value])").each(function(){
				opt = $(this);
				val = opt.text().trim();
				opt.attr("data-value",val);
			});
			fi.data("options",target.find("option"));
		});
	}
	function rd(str){
		param = fi.data("param");
		return param.accentFolding ? removeDiacritics(str) : str;
	}
	function event_triggered(e){
		param= fi.data("param");
		if(param.min <= $(this).val().length){
			target.empty();
			fi.data("filtered",true);
			fi.data("options").filter(function(){
				opt = $(this);
				if(param.multipleWord.active){
					words = fi.val().split(" ");
					var rep = (param.multipleWord.method == 'and');
					$.each(words,function(id,val){
						if(param.multipleWord.method == 'and'){
							rep = rep && (rd(opt.data("value")).toLowerCase().indexOf(rd(val).toLowerCase()) != -1);
						}else{
							rep = rep || (rd(opt.data("value")).toLowerCase().indexOf(rd(val).toLowerCase()) != -1);
						}
					});
					return rep;
				}else{
					return (rd(opt.data("value")).toLowerCase().indexOf(rd(fi.val()).toLowerCase()) != -1);
				}
			}).appendTo(target);
		}else{
			if(fi.data("filtered")){
				fi.data("options").appendTo(target);
				fi.data("filtered",false);
			}
		}
	}
	return fi;
}
