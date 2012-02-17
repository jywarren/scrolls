class CreatePanels < ActiveRecord::Migration
  def self.up
    create_table :panels do |t|

	t.integer :scroll_id, :default => 0, :null => false
	t.integer :panel_id, :default => 0, :null => false
	t.text :image_data, :default => "", :null => false, :limit => 4294967295

      t.timestamps
    end
  end

  def self.down
    drop_table :panels
  end
end
