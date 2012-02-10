Scrolls = {
        initialize: function() {
                this.element = $('canvas')
                this.element.observe('mouseup',Scrolls.on_mouseup)
                this.element.observe('mousedown',Scrolls.on_mousedown)
                this.element.observe('mousemove',Scrolls.on_mousemove)
                this.canvas = this.element.getContext('2d');
                $C = this.canvas
                this.width = document.width
                this.height = document.height
                this.element.style.width = this.width+"px"
                this.element.style.height = this.height+"px"
                this.element.width = this.width
                this.element.height = this.height
		setInterval(Scrolls.draw,250)
        },
	draw: function() {
		for (i=0;i<Scrolls.width;i++) {
	                pixels = $C.getImageData(i+1,0,1,Scrolls.height)
	                $C.putImageData(pixels,i,0)
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

