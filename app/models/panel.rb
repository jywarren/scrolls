class Panel < ActiveRecord::Base

	belongs_to :scrolls

	def data_url
		"data:image/png;base64,"+self.image_data
	end

end
