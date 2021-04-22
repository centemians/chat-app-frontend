import { gql, useMutation } from "@apollo/client";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";

const MainContainer = styled.div``;

const REGISTER_USER = gql`
  mutation($email: String!, $password: String!) {
    registerUser(email: $email, password: $password)
  }
`;

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [registerUser, { loading, data }] = useMutation(REGISTER_USER);

  console.log(loading, data);

  return (
    <MainContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(email, password);
          registerUser({
            variables: {
              email,
              password,
            },
          });
          history.push("/");
        }}
      >
        <div>
          <input
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </MainContainer>
  );
};

export default Register;
