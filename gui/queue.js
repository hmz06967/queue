function buf_default() {
	return {
		head: 0,
		tail: 0,
		limits: 10,
		count: 0,
		queue_buffer: {
			buffer: {},
			buff_size: 0,
			psize: 0
		}
	};
}

var queue_struct = buf_default();
var queue_interval;
var CIRCULAR_SIZE  =  10;


function update_okbar(params) {
	$(".top i.borspan").each(function(i, v){
		var h = $(v);
		if(h.hasClass("head"))
			h.removeClass("head");
	});   
	if(params=="clear"){
		$("#front_emsg").text("");
		$("#back_emsg").text("");
		$(".top i.borspan.item"+(queue_struct.head)).addClass("head");
 
	}else{
		$(".top i.borspan.item"+(queue_struct.head)).addClass("head");
		$(".top i.borspan.item"+(queue_struct.head+1)).removeClass("head");    
		$("#clear_emsg").text("");             
	}
}
function info_update(params) {
	$("#info_head .value").text(queue_struct.head);
	$("#info_tail .value").text(queue_struct.tail);
	update_okbar(params);
}
function buf_clear(params) {
	queue_struct = buf_default();
	info_update();
	for(var i=0;i<CIRCULAR_SIZE;i++)add_item(i, "");
}    
function is_empty(params) {
	if(queue_struct.head == queue_struct.tail){
		$("#clear_emsg").text("is empty");
		return 1;
	}
	return 0;
}
function is_full(params) {
	var tmphead = queue_struct.head;
	if((tmphead-1) < 0 ) tmphead = CIRCULAR_SIZE;
	
	if(tmphead-1 == queue_struct.tail){
		if(params=="front") $("#front_emsg").text("is full");
		if(params=="back") $("#back_emsg").text("is full");
		return 1;
	}
	return 0;
}
function add_item(item_id, value){
	queue_struct.count++;
	$(".top .item"+item_id+" .value").text(value);
}
function remove_item(item_id) {
	queue_struct.count--;
	$(".top .item"+item_id+" .value").empty();  
}
function next_peek(params) {
	if(!is_empty()){
		if((queue_struct.head)<CIRCULAR_SIZE){
			remove_item(queue_struct.head);
			
			queue_struct.head++; 
		}
		if(queue_struct.head>=CIRCULAR_SIZE){
			queue_struct.head = 0;
		}

	}
	info_update("clear");
}
function ekle_back(params) {
	var value = $("#back_value").val();
	var item_id ;
	if(!is_full("back")){
		item_id = queue_struct.tail;
		add_item(item_id, value);
		queue_struct.tail++;
	}else{
		return 0;
	}

	if((queue_struct.tail) >= CIRCULAR_SIZE){
		queue_struct.tail = 0;
	} 
	
	$("#clear_emsg").text(""); 

	info_update();

}
function ekle_front(params) {
	var value = $("#front_value").val();
	var item_id;
	
	if(!is_full("front")){
		
		queue_struct.head--;
	}else{
		return 0;
	}

	if(queue_struct.head < 0){
		queue_struct.head = CIRCULAR_SIZE - 1;
	}

	item_id = queue_struct.head;
	add_item(item_id, value); 
	
	info_update();
}

function set_stick(content) {
	value = $("#circular_size").val();
	CIRCULAR_SIZE = value;
	draw_stick(value);
	console.log(value);
}

function draw_stick(size){
	var topdiv = $(".top");
	topdiv.empty();
	for(var i=0; i < size;i++)
	{
		var rotate = i*360/size;
		topdiv.append('<i class="borspan item'+i+'" style="transform: rotate('+rotate+'deg);"><span class="number value"></span><span class="number name">'+i+'</span><span class="okbar"></span></i>');
	};
	$("#circular_size").value = size;
};

function test_mode(params) {
	queue_interval = setInterval(()=>{
		$("#back_value").val(Math.floor(Math.random() * 50));
		ekle_back();
		if((queue_struct.count+1)>=queue_struct.limits){
			clearInterval(queue_interval);
			queue_interval = setInterval(()=>{
				next_peek();
				if(queue_struct.count<=0)
					clearInterval(queue_interval);
			}, 500);
		}
	}, 500);
	

}

$(document).ready(function(params) {

	draw_stick(CIRCULAR_SIZE);
	info_update();
});
