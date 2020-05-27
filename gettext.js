/*!sprintf.js | Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license*/(function(ctx){var sprintf=function(){if(!sprintf.cache.hasOwnProperty(arguments[0])){sprintf.cache[arguments[0]]=sprintf.parse(arguments[0]);}
return sprintf.format.call(null,sprintf.cache[arguments[0]],arguments);};sprintf.format=function(parse_tree,argv){var cursor=1,tree_length=parse_tree.length,node_type='',arg,output=[],i,k,match,pad,pad_character,pad_length;for(i=0;i<tree_length;i++){node_type=get_type(parse_tree[i]);if(node_type==='string'){output.push(parse_tree[i]);}
else if(node_type==='array'){match=parse_tree[i];if(match[2]){arg=argv[cursor];for(k=0;k<match[2].length;k++){if(!arg.hasOwnProperty(match[2][k])){throw(sprintf('[sprintf] property "%s" does not exist',match[2][k]));}
arg=arg[match[2][k]];}}
else if(match[1]){arg=argv[match[1]];}
else{arg=argv[cursor++];}
if(/[^s]/.test(match[8])&&(get_type(arg)!='number')){throw(sprintf('[sprintf] expecting number but found %s',get_type(arg)));}
switch(match[8]){case 'b':arg=arg.toString(2);break;case 'c':arg=String.fromCharCode(arg);break;case 'd':arg=parseInt(arg,10);break;case 'e':arg=match[7]?arg.toExponential(match[7]):arg.toExponential();break;case 'f':arg=match[7]?parseFloat(arg).toFixed(match[7]):parseFloat(arg);break;case 'o':arg=arg.toString(8);break;case 's':arg=((arg=String(arg))&&match[7]?arg.substring(0,match[7]):arg);break;case 'u':arg=arg>>>0;break;case 'x':arg=arg.toString(16);break;case 'X':arg=arg.toString(16).toUpperCase();break;}
arg=(/[def]/.test(match[8])&&match[3]&&arg>=0?'+'+arg:arg);pad_character=match[4]?match[4]=='0'?'0':match[4].charAt(1):' ';pad_length=match[6]-String(arg).length;pad=match[6]?str_repeat(pad_character,pad_length):'';output.push(match[5]?arg+pad:pad+arg);}}
return output.join('');};sprintf.cache={};sprintf.parse=function(fmt){var _fmt=fmt,match=[],parse_tree=[],arg_names=0;while(_fmt){if((match=/^[^\x25]+/.exec(_fmt))!==null){parse_tree.push(match[0]);}
else if((match=/^\x25{2}/.exec(_fmt))!==null){parse_tree.push('%');}
else if((match=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt))!==null){if(match[2]){arg_names|=1;var field_list=[],replacement_field=match[2],field_match=[];if((field_match=/^([a-z_][a-z_\d]*)/i.exec(replacement_field))!==null){field_list.push(field_match[1]);while((replacement_field=replacement_field.substring(field_match[0].length))!==''){if((field_match=/^\.([a-z_][a-z_\d]*)/i.exec(replacement_field))!==null){field_list.push(field_match[1]);}
else if((field_match=/^\[(\d+)\]/.exec(replacement_field))!==null){field_list.push(field_match[1]);}
else{throw('[sprintf] huh?');}}}
else{throw('[sprintf] huh?');}
match[2]=field_list;}
else{arg_names|=2;}
if(arg_names===3){throw('[sprintf] mixing positional and named placeholders is not (yet) supported');}
parse_tree.push(match);}
else{throw('[sprintf] huh?');}
_fmt=_fmt.substring(match[0].length);}
return parse_tree;};var vsprintf=function(fmt,argv,_argv){_argv=argv.slice(0);_argv.splice(0,0,fmt);return sprintf.apply(null,_argv);};function get_type(variable){return Object.prototype.toString.call(variable).slice(8,-1).toLowerCase();}
function str_repeat(input,multiplier){for(var output=[];multiplier>0;output[--multiplier]=input){}
return output.join('');}
ctx.sprintf=sprintf;ctx.vsprintf=vsprintf;})(typeof exports!="undefined"?exports:window);i18n_catalog={};if(window.get_catalog)get_catalog(window);gettext=function(msgid){var value=i18n_catalog[msgid],msgstr;if(typeof(value)=='undefined'){msgstr=msgid;}else{msgstr=(typeof(value)=='string')?value:value[0];}
if(arguments.length>1){var args=arguments;args[0]=msgstr;msgstr=sprintf.apply(null,args);}
return msgstr;};ngettext_0=function(singular,plural,count){var value=i18n_catalog[singular];if(typeof(value)=='undefined'){return(count==1)?singular:plural;}else{if(typeof(value)=='string'){return value;}else{reduced_count=(count<=1)?0:1;return value[reduced_count];}}};ngettext=function(singular,plural,count){var rc=ngettext_0(singular,plural,count);return sprintf(rc,{num:count});};