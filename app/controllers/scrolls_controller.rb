class ScrollsController < ApplicationController

	def index
		puts "HELLO FUCKIN WORLD"
		@scrolls = Scroll.find :all
	end

	def show
		@scroll = Scroll.find(params[:id])
		
	end

	def save
		@scroll = Scroll.find params[:id]
		@panel = Panel.new({:scroll_id => @scroll.id}) unless @panel = @scroll.get_panel()
		# copy new shit onto the panel
		return :text => @panel.save
	end

	# get all panels and display as a mural
	def static
		@scroll = Scroll.find(params[:id])
	end

	# display panel x
	def panel
		@panel = Panel.find(:first, :conditions => {:scroll_id => params[:id],:id => params[:panel_id]}) 
                respond_to do |format|
                        format.html {}
                        format.png { 
                                headers['Content-Type'] = 'image/png'
                                headers['Cache-Control'] = 'public'
                                headers['Expires'] = 'Mon, 28 Jul 2020 23:30:00 GMT'
                                render :text => @panel.image_data
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
