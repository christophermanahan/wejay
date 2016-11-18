import React from 'react'

const Message = props => {
    const { message } = props
    return (
     <div className="quote">
        <span>{message.name}</span> - {message.text}
     </div>
     )
}

const MessageList = props => {
        let messages = []
        let id = 0
        for(let message in props.messages) {
            props.messages[message]['id'] = id++
            messages.push(props.messages[message])
        }
        return (
        <div>
          {
           messages && messages.map(message => <Message key={message.id} message={message} />)
          }
        </div>

        )

}


export default MessageList
