import * as React from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { Chat, DonutLarge, MoreVert, SearchOutlined } from "@material-ui/icons";
import styled from "styled-components";
import Room from "./Room";
import { gql, useQuery } from "@apollo/client";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.35;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-right: 1px solid lightgray;
  min-width: 10vh;
`;

const HeaderRight = styled.div``;

const SidebarSearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f6f6f6;
  height: 39px;
  padding: 10px;
`;

const SidebarSearch = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 100%;
  height: 35px;
  border-radius: 20px;

  .MuiSvgIcon-root {
    color: gray;
    padding: 10px;
  }

  input {
    border: none;
    margin-left: 10px;
    outline-width: 0;
  }
`;

const ChatsContainer = styled.div`
  flex: 1;
  background-color: #fff;
  overflow: scroll;
`;

const GET_ALL_ROOMS = gql`
  query {
    getAllRooms {
      id
      room_name
    }
  }
`;

interface SidebarProps {
  setRoomId: Function;
}

const Sidebar: React.FC<SidebarProps> = ({ setRoomId }) => {
  const { loading, data } = useQuery(GET_ALL_ROOMS);
  console.log(loading, data);
  return (
    <MainContainer>
      <SidebarHeader>
        <Avatar src="https://qph.fs.quoracdn.net/main-thumb-174858773-200-uowxarmgnmxnuxmdsoenouuwsirzilix.jpeg" />
        <HeaderRight>
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderRight>
      </SidebarHeader>

      <SidebarSearchContainer>
        <SidebarSearch>
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </SidebarSearch>
      </SidebarSearchContainer>

      <ChatsContainer>
        {data &&
          data.getAllRooms.map((roomData: any) => (
            <Room roomData={roomData} setRoomId={setRoomId} />
          ))}
      </ChatsContainer>
    </MainContainer>
  );
};

export default Sidebar;
