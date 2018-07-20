
function ArrayCompare(pData) {
    data=pData;
    type=typeof pData;
}

ArrayCompare.prototype.set = (param) => {  
    data=param;
    type=typeof param;
}

ArrayCompare.prototype.show= () => { 
    console.log("this.data", typeof this.data,this.data);
 }
 
ArrayCompare.prototype.find = function(param){
    if (typeof data=='object' && typeof param!='function'){
            return data.find(item => {  
                return item== param;
            });
        }
    if (typeof param=='function'){
        return data.find(param);
    }
}

ArrayCompare.prototype.check= (param,value) => { 
        for(var i=0;i<param.length;i++ ){
            var ex=data.find(item => {  
                    return item[value]==param[i][value]
                });
            if (typeof ex!='undefined'){ex.selected=true;}
        }
 }
