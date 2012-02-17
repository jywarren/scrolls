$.ajaxSetup ({ cache: false }); 
var ajax_load = "<img src='/images/spinner-small.gif' alt='loading...' />";
Scrolls = {
	pointer_x: 0,
	pointer_y: 0,
	x_offset: 0,
	initialize: function() {
		this.element = $('#canvas')
		$('body').mouseup(Scrolls.on_mouseup)
		$('body').mousedown(Scrolls.on_mousedown)
		$('body').mousemove(Scrolls.on_mousemove)
		window.addEventListener('touchend',Scrolls.on_mouseup)
		window.addEventListener('touchstart',Scrolls.on_mousedown)
		window.addEventListener('touchmove',Scrolls.on_mousemove)
		this.element = $('#canvas')[0]
		this.canvas = this.element.getContext('2d');
		$C = this.canvas
		this.width = 1000//$('body').width
		this.height = 500//$('body').height
		this.element.width = this.width+"px"
		this.element.height = this.height+"px"
		this.element.width = this.width
		this.element.height = this.height
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
	// fetch latest online canvas
	update: function() {
		// we can skip this for single-user mode
	},
	save: function() {
		for (var i = 0;i < (Scrolls.width/100);i++) {
			$.ajax({
				url: "/scrolls/save/"+Page.scroll_id,
				data: {
					panel_id: i,
					data_url: Scrolls.excerpt(i*100,100)
				},
				success: function(){
					console.log("uploaded")
				}
			})
		}
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

