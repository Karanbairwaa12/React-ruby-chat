# class Message < ApplicationRecord
#   after_create_commit { broadcast_message }

#   private

#   def broadcast_message
#     ActionCable.server.broadcast('MessagesChannel', {
#                                    id:,
#                                    body:
#                                  })
#   end
# end

class Message < ApplicationRecord
  attribute :content, :string
  attribute :author, :string  # Add this line to include the 'author' attribute

  validates :content, presence: true
  validates :room, presence: true
  validates :author, presence: true  # Add this line to validate the presence of 'author'
end
