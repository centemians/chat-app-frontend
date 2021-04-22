import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import fetch from "cross-fetch";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { errorLink } from "./ErrorLinks";
import { getAccessToken, setAccessToken } from "../../accessToken";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";

const subscriptionClient = new SubscriptionClient(
  "ws://localhost:9000/subscription",
  {
    reconnect: true,
  }
);

export const wsLink = new WebSocketLink(subscriptionClient);

export const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
  fetch,
  credentials: "include",
});

const requestLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  console.log("=======>>>", accessToken);
  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: `bearer ${accessToken}`,
      },
    });
  }

  return forward(operation);
});

export const link = split(
  ({ query }) => {
    // split based on operation type
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  requestLink.concat(httpLink)
);

class ApolloClientProvider {
  private static instance: ApolloClientProvider;

  private client: any;

  // eslint-disable-next-line no-useless-constructor
  private constructor() {
    // private consructor
  }

  static getInstance() {
    if (!ApolloClientProvider.instance) {
      ApolloClientProvider.instance = new ApolloClientProvider();

      ApolloClientProvider.instance.client = new ApolloClient({
        //@ts-ignore
        link: ApolloLink.from([
          // @ts-ignore
          new TokenRefreshLink({
            accessTokenField: "accessToken",
            isTokenValidOrUndefined: () => {
              const token = getAccessToken();

              if (!token) {
                return true;
              }

              try {
                const { exp }: any = jwtDecode(token);
                if (Date.now() >= exp * 1000) {
                  return false;
                }
                return true;
              } catch {
                return false;
              }
            },
            fetchAccessToken: () => {
              return fetch("http://localhost:9000/refresh_token", {
                method: "POST",
                credentials: "include",
              });
            },
            handleFetch: (accessToken) => {
              setAccessToken(accessToken);
            },
            handleError: (err) => {
              // FIXME: handle Error
              console.warn("Your refresh token is invalid. Try to relogin");
              console.error(err);
            },
          }),
          errorLink,
          link,
        ]),
        cache: new InMemoryCache(),
      });
    }
    return ApolloClientProvider.instance;
  }

  getClient() {
    return this.client;
  }
}

export default ApolloClientProvider;
