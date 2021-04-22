/* eslint-disable */
import { onError } from "apollo-link-error";

export const errorLink = onError(({ graphQLErrors, operation }) => {
  console.log(graphQLErrors, operation);
  //   if (graphQLErrors) {
  //     for (const err of graphQLErrors) {
  //       switch (err.extensions!.code) {
  //         case "FORBIDDEN":
  //           location.href = "/access-restricted";
  //           break;
  //         case "BAD_USER_INPUT":
  //           location.href = "/404-not-found";
  //           break;
  //         case "INTERNAL_SERVER_ERROR":
  //           location.href = "/unknown-error";
  //           break;
  //         case "UNAUTHENTICATED":
  //           // error code is set to UNAUTHENTICATED
  //           // when AuthenticationError thrown in resolver
  //           operation.setContext({
  //             headers: {},
  //           });
  //           localStorage.removeItem("referrer");
  //           location.href = "/login";
  //           break;
  //       }
  //     }
  //   }
  // if (networkError) {
  //   console.log(networkError);

  // operation.setContext({
  //   headers: {}
  // })
  // history.push('/login');
  // if you would also like to retry automatically on
  // network errors, we recommend that you use
  // apollo-link-retry
  // }
  return;
});
