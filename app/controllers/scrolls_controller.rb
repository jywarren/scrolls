class ScrollsController < ApplicationController

	def index
		@scrolls = Scroll.find :all
	end

	def show
		@scroll = Scroll.find(params[:id])
	end

	def save
		@scroll = Scroll.find params[:id]
		if @panel = Panel.find(:first,:conditions => {:scroll_id => @scroll.id, :panel_id => params[:panel_id]})
			# move this code into model:
			# copy new shit onto the existing panel
	                require 'rubygems'
	                require 'RMagick'

			# not sure why using ImageList and not an Image, but thats the example. can try rewrite 
	                imagelist = Magick::ImageList.new 
			# maybe need to remove "data:image/png,base64;" 
	                imagelist.from_blob(Base64.decode64(params[:data_url][22..-1]))
	                newimage = imagelist.cur_image

			# open local image, mush them together:
	                imagelist.from_blob(Base64.decode64(@panel.data_url[22..-1]))
			oldimage = imagelist.cur_image

			oldimage.composite!(newimage,0,0,Magick::OverCompositeOp)

			# save as base64 again
			@panel.data_url = "data:image/png;base64,"+Base64.encode64(oldimage.to_blob)

		else @panel = Panel.new({:panel_id => params[:panel_id],:scroll_id => @scroll.id}) 
			@panel.image_data = params[:data_url]
		end
		render :text => @panel.save
	end

	# get all panels and display as a mural
	def static
		@scroll = Scroll.find(params[:id])
		@panels = Panel.find_all_by_scroll_id(params[:id],:order => "panel_id")
	end

	# display panel x
	def panel
		@panel = Panel.find(:first, :conditions => {:scroll_id => params[:id],:panel_id => params[:panel_id]}) 
                respond_to do |format|
                        format.html { render :text => "<img src='"+@panel.image_data+"' />" }
                        format.png { 
                                headers['Content-Type'] = 'image/png'
                                headers['Cache-Control'] = 'public'
                                headers['Expires'] = 'Mon, 28 Jul 2020 23:30:00 GMT'
                                render :text => @panel.image_data[-23,0]
                        }
                end
	end

	def create
		# http://roninonrails.blogspot.com/2008/06/using-non-standard-primary-keys-with.html
		@scroll = Scroll.new({:name => params[:name]})
		@scroll.save!
		redirect_to "/scrolls/show/"+@scroll.id.to_s
	end

end
