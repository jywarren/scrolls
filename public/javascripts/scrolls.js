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
		//Scrolls.send()
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
		var url = "/scrolls/save/"+Page.scroll_id
		// this isn't right... gotta parse the response and dump it into the pixel buffer
		$("#result").html(ajax_load).load(url)

		//options hash with params (dataUrl)
	},
	get_panel: function(panel_id) {
		var x = Scrolls.width-100
		var dataUrl = Scrolls.excerptCanvas(x,0,100,Scrolls.height,Scrolls.canvas)
		console.log(dataUrl)
		// pixels = $C.getImageData(x,y,1,1).data
		//pixels.data[0] = Clash.colors[Clash.color][0]
		//pixels.data[1] = Clash.colors[Clash.color][1]
		//pixels.data[2] = Clash.colors[Clash.color][2]
		//$C.putImageData(pixels,x,y)
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
		// dumb but effective: just copy every pixel in
		var outputdata = excerptCanvasContext.getImageData(0,0,width,height)
		var sourcedata = source.getImageData(x1,y1,width,height)
		var l = sourcedata.data.length/4
		for (var i = 0; i < l; i++) {
			var red = sourcedata.data[i * 4 + 0];
			var green = sourcedata.data[i * 4 + 1];
			var blue = sourcedata.data[i * 4 + 2];
			var alpha = sourcedata.data[i * 4 + 3];
			outputdata[i * 4 + 0] = red
			outputdata[i * 4 + 1] = green
			outputdata[i * 4 + 2] = blue
			outputdata[i * 4 + 3] = alpha
		}
		excerptCanvasContext.putImageData(outputdata,0,0)

		//      for (i=0;i<sourcedata.length;i++) {
		//	      var value = sourcedata[i]
		//	      var red = value[0], green = value[1], blue = value[2], alpha = value[3]
		//	      excerptCanvasContext.putImageData([red,green,blue,alpha],x1,y1)
		//      }
		return excerptCanvasContext.canvas.toDataURL()
	}

}

