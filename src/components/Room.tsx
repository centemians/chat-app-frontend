import { Avatar } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  padding: 20px;
  cursor: pointer;
  border-bottom: 1px solid #f6f6f6;
  align-items: center;

  :hover {
    background-color: #ebebeb;
  }
`;

const ChatDescription = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
`;

const RoomName = styled.div`
  display: flex;
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: bold;
`;
const LastMessage = styled.div``;

interface RoomProps {
  roomData: any;
  setRoomId: Function;
}

const Room: React.FC<RoomProps> = ({ roomData, setRoomId }) => {
  return (
    <MainContainer onClick={() => setRoomId(roomData.id)} role="button">
      <Avatar />
      <ChatDescription>
        <RoomName>{roomData.room_name}</RoomName>
        <LastMessage>This is the last message</LastMessage>
      </ChatDescription>
    </MainContainer>
  );
};

export default Room;
