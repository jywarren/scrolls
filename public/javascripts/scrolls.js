Scroll = {
        initialize: function() {
                this.element = $('canvas')
                this.element.observe('mouseup',Scroll.on_mouseup)
                this.element.observe('mousedown',Scroll.on_mousedown)
                this.element.observe('mousemove',Scroll.on_mousemove)
                this.canvas = this.element.getContext('2d');
                $C = this.canvas
                this.width = document.width
                this.height = document.height
                this.element.style.width = this.width+"px"
                this.element.style.height = this.height+"px"
                this.element.width = this.width
                this.element.height = this.height
		setInterval(this.draw,500)
        },
	draw: function() {
		for (i=0;i<this.width;i++) {
	                pixels = $C.getImageData(i,y,this.height,1)
	                //pixels.data[0] = Clash.colors[Clash.color][0]
	                //$C.putImageData(pixels,i,y)
		}
	},
	on_mouseup: function(e) {
		self.mousedown = false
		self.pointer_x = false
		self.pointer_y = false
	},
	on_mousedown: function(e) {
		self.mousedown = true
	},
	on_mousemove: function(e) {
		if (self.mousedown) {
		$C.strokeStyle = "#000"
		$C.lineWidth = 2
		self.old_x = self.pointer_x
		self.old_y = self.pointer_y
		self.pointer_x = Event.pointerX(e)
		self.pointer_y = Event.pointerY(e)
		$C.beginPath()
		if (self.old_x) $C.moveTo(self.old_x,self.old_y)
		else $C.moveTo(self.pointer_x,self.pointer_y)
		$C.lineTo(self.pointer_x,self.pointer_y)
		$C.stroke()
		}
	}
}

