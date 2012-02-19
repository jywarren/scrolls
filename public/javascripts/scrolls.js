$.ajaxSetup ({ cache: false }); 
var ajax_load = "<img src='/images/spinner-small.gif' alt='loading...' />";
Scrolls = {
	pointer_x: 0,
	pointer_y: 0,
	x_offset: 0,
	initialize: function() {
		Scrolls.element = $('#canvas')
		$('body').mouseup(Scrolls.on_mouseup)
		$('body').mousedown(Scrolls.on_mousedown)
		$('body').mousemove(Scrolls.on_mousemove)
		window.addEventListener('touchend',Scrolls.on_mouseup)
		window.addEventListener('touchstart',Scrolls.on_mousedown)
		window.addEventListener('touchmove',Scrolls.on_mousemove)
		Scrolls.element = $('#canvas')[0]
		Scrolls.canvas = Scrolls.element.getContext('2d');
		$C = Scrolls.canvas
		Scrolls.width = 1000//$('body').width
		Scrolls.height = 500//$('body').height
		Scrolls.element.width = Scrolls.width+"px"
		Scrolls.element.height = Scrolls.height+"px"
		Scrolls.element.width = Scrolls.width
		Scrolls.element.height = Scrolls.height
		setInterval(Scrolls.draw,1500)
	},
	draw: function() {
		var stripwidth = 4
		if (false){//!this.mousedown) {
			for (i=0;i<Scrolls.width;i++) {
				pixels = $C.getImageData(i+1,0,stripwidth,Scrolls.height)
				$C.putImageData(pixels,i,0)
			}
		this.x_offset += stripwidth
		}
	},
	on_mouseup: function(e) {
		e.preventDefault()
		Scrolls.mousedown = false
		Scrolls.pointer_x = false
		Scrolls.pointer_y = false
		Scrolls.save()
	},
	on_mousedown: function(e) {
		e.preventDefault()
		Scrolls.mousedown = true
	},
	on_mousemove: function(e) {
		e.preventDefault()
		e.stopPropagation();
		Scrolls.old_x = Scrolls.pointer_x
		Scrolls.old_y = Scrolls.pointer_y

		if (Scrolls.mousedown) {
			$C.strokeStyle = "#000"
			$C.lineWidth = 2
			if (e.touches && (e.touches[0] || e.changedTouches[0])) {
				var touch = e.touches[0] || e.changedTouches[0];
				Scrolls.pointer_x = touch.pageX
				Scrolls.pointer_y = touch.pageY
			} else {
				Scrolls.pointer_x = e.pageX
				Scrolls.pointer_y = e.pageY
			}
			$C.beginPath()
			if (Scrolls.old_x) $C.moveTo(Scrolls.old_x,Scrolls.old_y)
			else $C.moveTo(Scrolls.pointer_x,Scrolls.pointer_y)
			$C.lineTo(Scrolls.pointer_x,Scrolls.pointer_y)
			$C.stroke()
		}
                $('#cursor').css('top',(Scrolls.pointer_y-4))
                $('#cursor').css('left',(Scrolls.pointer_x-4))
	},
	// save panels
	save: function() {
		var panels = []
		for (var i = 0;i < (Scrolls.width/100);i++) {
			panels.push({panel_id: Page.first_panel+1+i,data_url: Scrolls.excerpt(i*100,100)})
		}
		$.post("/scrolls/save/"+Page.scroll_id,
			{
				panels:JSON.stringify(panels)
			},
			function(data){
				$('#backdrop').html(data)
				Scrolls.canvas.clearRect(0, 0, Scrolls.width, Scrolls.height)
				$("#advance")[0].show()
			})
	},
	// update backdrop
	update: function() {
		// /scrolls/window/1?panel_id=2
	},
	// advance the scroll; create a new panel
	advance: function() {
		$.ajax({
			url:"/scrolls/advance/"+Page.scroll_id,
			success: function(data) {
				$('#backdrop').html(data)
				Scrolls.first_panel += 1
				Scrolls.last_panel += 1
			} 
		})
	},
	excerpt: function(x,width) {
		return Scrolls.excerptCanvas(x,0,x+width,Scrolls.height,Scrolls.canvas)
	},
	/**
	 * Returns a dataURL string of any rect from the offered canvas
	 */
	excerptCanvas: function(x1,y1,x2,y2,source) {
		source = source || $C
		var width = x2-x1, height = y2-y1
		$('body').append("<canvas style='' id='excerptCanvas'></canvas>")
		var element = $('#excerptCanvas')[0]
		element.width = width
		element.height = height
		var excerptCanvasContext = element.getContext('2d')
		var sourcedata = source.getImageData(x1,y1,width,height)
		excerptCanvasContext.putImageData(sourcedata,0,0)
		return excerptCanvasContext.canvas.toDataURL()
	}

}

