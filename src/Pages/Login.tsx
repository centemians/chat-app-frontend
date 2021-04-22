import { gql, useMutation } from "@apollo/client";
import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { setAccessToken } from "../accessToken";

const MainContainer = styled.div``;

const LOGIN_USER = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

// interface LoginProps
//   history?: any;
// }

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginUser, { loading, data }] = useMutation(LOGIN_USER);

  console.log(loading, data);

  if (data && data.login) {
    setAccessToken(data.login.accessToken);
  }

  return (
    <MainContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(email, password);
          loginUser({
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
        <button type="submit">Login</button>
      </form>
    </MainContainer>
  );
};

export default Login;
