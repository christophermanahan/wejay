import React from 'react'

const Message = props => {
    const { message } = props;
    return (
     <div className="quote">
        <span>{message.name}</span> - {message.text}
     </div>
     )
}

const MessageList = props => {
    let messages = [];
    for (let message in props.messages) {
        messages.push(props.messages[message]);
    }

    return (
    <div>
      {
       messages && messages.map((message, index) => <Message key={index} message={message} />)
      }
    </div>

    )

}


export default MessageList
