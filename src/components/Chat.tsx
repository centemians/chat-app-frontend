import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Avatar, IconButton } from "@material-ui/core";
import {
  InsertEmoticon,
  Link,
  Mic,
  MoreVert,
  Search,
} from "@material-ui/icons";
import produce from "immer";
import * as React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.65;
`;

const ChatHeader = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  border-bottom: 1px solid lightgray;
`;

const HeaderInfo = styled.div`
  flex: 1;
  padding-left: 20px;
`;

const RoomName = styled.div`
  margin-bottom: 3px;
  font-weight: 500;
`;

const LastSeen = styled.div`
  color: gray;
`;

const HeaderRight = styled.div``;

const ChatBody = styled.div`
  flex: 1;
  background-image: url("https://i.pinimg.com/originals/ab/ab/60/abab60f06ab52fa7846593e6ae0c9a0b.png");
  /* background-repeat: repeat; */
  background-position: center;
  padding: 30px;
  overflow: scroll;
`;

const ChatMessage = styled.div`
  position: relative;
  font-size: 16px;
  padding: 10px;
  width: fit-content;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 30px;

  &.chat_reciever {
    margin-left: auto;
    background-color: #dcf8c6;
  }
`;

const ChatName = styled.span`
  position: absolute;
  top: -15px;
  font-weight: 800;
  font-size: 12px;
`;

const ChatTimeStamp = styled.span`
  margin-left: 10px;
  font-size: xx-small;
`;

const ChatFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  border-top: 1px solid lightgray;

  .MuiSvgIcon-root {
    padding: 10px;
    color: gray;
  }
`;

const MessageForm = styled.form`
  flex: 1;
  display: flex;

  input {
    flex: 1;
    border-radius: 30px;
    padding: 10px;
    border: none;
  }

  button {
    display: none;
  }
`;

const GET_ALL_CHATS = gql`
  query($room_id: String!) {
    allChatsOfRoom(room_id: $room_id) {
      id
      message
      created_by
    }
  }
`;

const CREATE_NEW_MESSAGE = gql`
  mutation($room_id: String!, $message: String!, $created_by: String!) {
    createMessage(room_id: $room_id, message: $message, created_by: $created_by)
  }
`;

const UPDATE_MESSAGE = gql`
  subscription($room_id: String!) {
    updateMessage(room_id: $room_id) {
      id
      message
    }
  }
`;

interface ChatProps {
  roomId: string;
  user: any;
}

const Chat: React.FC<ChatProps> = ({ roomId, user }) => {
  console.log("room id is: ", roomId);
  const inputRef = React.useRef(null);
  const [chatMessage, setChatMessage] = React.useState("");
  const { loading, data } = useQuery(GET_ALL_CHATS, {
    variables: { room_id: roomId },
    skip: roomId.length === 0,
  });

  const [createNewMessage] = useMutation(CREATE_NEW_MESSAGE);

  useSubscription(UPDATE_MESSAGE, {
    variables: { room_id: roomId },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log("subs data is: ", subscriptionData);
      const { allChatsOfRoom } = client.readQuery<any>({
        query: GET_ALL_CHATS,
        variables: { room_id: roomId },
      });
      const latestMessage = subscriptionData.data.updateMessage;
      client.writeQuery({
        query: GET_ALL_CHATS,
        variables: { room_id: roomId },
        data: {
          allChatsOfRoom: produce(allChatsOfRoom, (x: any) => {
            x.push(latestMessage);
          }),
        },
      });
    },
  });

  console.log(loading, data);
  console.log("message is: ", chatMessage);

  const formSubmitHandler = (e: any) => {
    e.preventDefault();
    setChatMessage("");
    createNewMessage({
      variables: {
        room_id: roomId,
        message: chatMessage,
        created_by: user.id,
      },
    });
  };

  return (
    <MainContainer>
      <ChatHeader>
        <Avatar />
        <HeaderInfo>
          <RoomName>Room Name</RoomName>
          <LastSeen>Last seen at ...</LastSeen>
        </HeaderInfo>
        <HeaderRight>
          <IconButton>
            <Search />
          </IconButton>
          <IconButton>
            <Link />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderRight>
      </ChatHeader>

      <ChatBody>
        {data &&
          data.allChatsOfRoom.map((data: any) => (
            <ChatMessage
              className={data.created_by === user.id ? "chat_reciever" : ""}
            >
              <ChatName>{data.created_by}</ChatName>
              {data.message}
              <ChatTimeStamp>{new Date().toUTCString()}</ChatTimeStamp>
            </ChatMessage>
          ))}
      </ChatBody>

      <ChatFooter>
        <InsertEmoticon />
        <MessageForm onSubmit={(e) => formSubmitHandler(e)}>
          <input
            ref={inputRef}
            placeholder="Type a message"
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button type="submit">Send message</button>
        </MessageForm>
        <Mic />
      </ChatFooter>
    </MainContainer>
  );
};

export default Chat;
