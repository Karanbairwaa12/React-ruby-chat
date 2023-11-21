class AddRoomToMessages < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :room, :string
  end
end
