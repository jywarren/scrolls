$.ajaxSetup ({ cache: false }); 
var ajax_load = "<img src='/images/spinner-small.gif' alt='loading...' />";
Scrolls = {
	initialize: function() {
		this.element = $('#canvas')
		this.element.mouseup(Scrolls.on_mouseup)
		this.element.mousedown(Scrolls.on_mousedown)
		this.element.mousemove(Scrolls.on_mousemove)
		this.element.bind('touchend',Scrolls.on_mouseup)
		this.element.bind('touchstart',Scrolls.on_mousedown)
		this.element.bind('touchmove',Scrolls.on_mousemove)
		this.canvas = this.element[0].getContext('2d');
		$C = this.canvas
		this.width = 1024//document.width
		this.height = 768//document.height
		this.element.width = this.width+"px"
		this.element.height = this.height+"px"
		this.element.width = this.width
		this.element.height = this.height
		setInterval(Scrolls.draw,1500)
	},
	draw: function() {
		var stripwidth = 4
		for (i=0;i<Scrolls.width;i++) {
			pixels = $C.getImageData(i+1,0,stripwidth,Scrolls.height)
			$C.putImageData(pixels,i,0)
		}
	},
	on_mouseup: function(e) {
		self.mousedown = false
		self.pointer_x = false
		self.pointer_y = false
		Scrolls.send
	},
	on_mousedown: function(e) {
		self.mousedown = true
	},
	on_mousemove: function(e) {
		self.old_x = self.pointer_x
		self.old_y = self.pointer_y

		if (self.mousedown) {
			$C.strokeStyle = "#000"
			$C.lineWidth = 2
			if (e.touches && (e.touches[0] || e.changedTouches[0])) {
				var touch = e.touches[0] || e.changedTouches[0];
				self.pointer_x = touch.pageX
				self.pointer_y = touch.pageY
			} else {
				self.pointer_x = e.pageX
				self.pointer_y = e.pageY
			}
			$C.beginPath()
			if (self.old_x) $C.moveTo(self.old_x,self.old_y)
		else $C.moveTo(self.pointer_x,self.pointer_y)
			$C.lineTo(self.pointer_x,self.pointer_y)
			$C.stroke()
		}
	},
	save: function() {
		var url = "/scrolls/save/"+Page.scroll_id
		// this isn't right... gotta parse the response and dump it into the pixel buffer
		$("#result").html(ajax_load).load(url)

		//options hash with params (dataUrl)
	},
	newest_panel: function() {
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
		$('body').insert("<canvas style='' id='excerptCanvas'></canvas>")
		var element = $('excerptCanvas')
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

