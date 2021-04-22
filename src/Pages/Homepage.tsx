import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";
import { getAccessToken } from "../accessToken";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

const MainContainer = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: #dadbd3;
`;

const WrapContainer = styled.div`
  display: flex;
  background-color: #ededed;
  margin-top: -50px;
  height: 90vh;
  width: 90vh;
  box-shadow: -1px 4px 20px -6px rgba(0, 0, 0, 0.75);
`;

const GET_LOGGED_IN_USER = gql`
  query {
    getLoggedInUser {
      id
      email
    }
  }
`;

const Homepage: React.FC<RouteComponentProps> = ({ history }) => {
  const [roomId, setRoomId] = React.useState("");

  React.useEffect(() => {
    console.log("access token: ==========>>>", getAccessToken());
    if (getAccessToken().length === 0) history.push("/login");
  }, [history]);

  const { loading, data } = useQuery(GET_LOGGED_IN_USER, {
    skip: getAccessToken().length === 0,
  });

  console.log(loading, data);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <MainContainer>
      <WrapContainer>
        <Sidebar setRoomId={setRoomId} />
        <Chat roomId={roomId} user={data?.getLoggedInUser} />
      </WrapContainer>
    </MainContainer>
  );
};

export default Homepage;
