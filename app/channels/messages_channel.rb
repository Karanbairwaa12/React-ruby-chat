class MessagesChannel < ApplicationCable::Channel
  def subscribed
    join_room(params[:room]) if params[:room].present?
  end

  def unsubscribed
    leave_room(params[:room]) if params[:room].present?
  end

  def join_room(room)
    stream_from "room_#{room}"
  end

  def leave_room(room)
    stop_all_streams
    # Additional logic to handle leaving the room if needed
  end

  def send_message(data)
    permitted_data = ActionController::Parameters.new(data).permit(:message, :room, :author)
  
    message = Message.create!(content: permitted_data[:message], room: permitted_data[:room], author: permitted_data[:author])
  
    ActionCable.server.broadcast("room_#{permitted_data[:room]}", { content: message.content, room: message.room, author: message.author })
  end
end

#   def subscribed
#     stream_from 'chat_channel'
#   end

#   def unsubscribed
#     # Any cleanup needed when the cable connection is disconnected
#   end

#   def send_message(data)
#     permitted_data = ActionController::Parameters.new(data).permit(:message)
#     Message.create!(content: permitted_data[:message])
#     # binding.pry
#     # ActionCable.server.broadcast('chat_channel', content: permitted_data[:message])
#     ActionCable.server.broadcast('chat_channel', { content: permitted_data[:message] })

#   end
# end
