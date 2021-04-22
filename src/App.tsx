import * as React from "react";
import ApolloClientProvider from "./Global/Providers/ApolloClientProvider";
import { ApolloProvider } from "@apollo/client";
import Routes from "./Routes/Routes";
import { setAccessToken } from "./accessToken";

function App() {
  const client = ApolloClientProvider.getInstance().getClient();
  const [load, setLoad] = React.useState(true);
  React.useEffect(() => {
    fetch("http://localhost:9000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      console.log("access token is: ", accessToken);
      setAccessToken(accessToken);
      setLoad(false);
    });
  }, []);

  console.log(load);
  if (load) {
    return <div>loading</div>;
  }

  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
