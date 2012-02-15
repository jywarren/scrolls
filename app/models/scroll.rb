class Scroll < ActiveRecord::Base

	has_many :panels
	validates_uniqueness_of :name

end
