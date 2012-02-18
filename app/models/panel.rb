class Panel < ActiveRecord::Base

	belongs_to :scrolls

	def validate
		Panel.find(:all,:conditions => {:panel_id => self.panel_id, :scroll_id => self.scroll_id})
	end

	def data_url
		#"data:image/png;base64,"+self.image_data
		self.image_data
	end

	def data_url=(d)
		self.image_data = d
	end

end
