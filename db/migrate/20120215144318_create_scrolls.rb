class CreateScrolls < ActiveRecord::Migration
  def self.up
    create_table :scrolls do |t|

	t.string :name, :default => "", :null => false
	t.text :description, :default => "", :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :scrolls
  end
end
