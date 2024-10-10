import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwt from "jsonwebtoken";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          // console.log("Realiza el post para autenticar");
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
            new URLSearchParams({
              client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
              grant_type: "password",
              username: credentials.username,
              password: credentials.password,
              scope: "openid",
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;
            // console.log("Responde el post para autenticar", data);

            // console.log("Tokens obtenidos: ", {
            //   accessToken: data.access_token,
            //   refreshToken: data.refresh_token,
            //   idToken: data.id_token,
            //   expiresIn: data.expires_in,
            //   refreshExpiresIn: data.refresh_expires_in,
            //   scope: data.scope,
            // });

            return {
              id: data.id_token,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              idToken: data.id_token,
              expiresIn: data.expires_in,
              refreshExpiresIn: data.refresh_expires_in,
              tokenType: data.token_type,
              notBeforePolicy: data["not-before-policy"],
              sessionState: data.session_state,
              scope: data.scope,
            };
          } else {
            console.error("Error: respuesta diferente de 200", response);
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ user, token }: { user: any; token: any }) {
      // console.log("JWT callback ejecutado");
      // console.log("User: ", user);
      // console.log("Token actual:", token);

      // Si el usuario existe, es la primera vez que inicia sesión, guardamos los tokens
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.idToken = user.idToken;
        token.accessTokenExpires = Date.now() + user.expiresIn * 1000;
        token.refreshTokenExpires = Date.now() + user.refreshExpiresIn * 1000;

        // console.log("Guardando tokens nuevos en el JWT:", {
        //   accessToken: token.accessToken,
        //   refreshToken: token.refreshToken,
        //   idToken: token.idToken,
        //   accessTokenExpires: new Date(token.accessTokenExpires),
        //   refreshTokenExpires: new Date(token.refreshTokenExpires),
        // });

        token.tokenType = user.tokenType;
        token.notBeforePolicy = user.notBeforePolicy;
        token.sessionState = user.sessionState;
        token.scope = user.scope;

        // Decodificar el idToken para obtener más información del usuario
        const decodedIdToken = jwt.decode(user.idToken) as {
          name: string;
          preferred_username: string;
          given_name: string;
          family_name: string;
          email: string;
          username: string;
        };

        // Guardamos estos valores en el token
        token.name = decodedIdToken.name;
        token.preferred_username = decodedIdToken.preferred_username;
        token.given_name = decodedIdToken.given_name;
        token.family_name = decodedIdToken.family_name;
        token.email = decodedIdToken.email;
        token.username = decodedIdToken.username;
      }

      // // Verificar si el access token ha expirado
      // console.log(
      //   "Verificando expiración del access token. Expira en:",
      //   new Date(token.accessTokenExpires)
      // );
      if (Date.now() > token.accessTokenExpires) {
        // console.log("Access token expirado. Intentando refrescar...");

        const refreshedToken = await refreshAccessToken(token);

        // Si no pudimos refrescar el token, devolvemos el error
        if (refreshedToken.error) {
          console.error("Error refrescando el token:", refreshedToken.error);
          return { ...token, error: "RefreshAccessTokenError" };
        }

        // console.log("Token refrescado exitosamente:", refreshedToken);

        // Actualizamos el token con los nuevos datos
        token = refreshedToken;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      // console.log("Callback de sesión ejecutado");

      // Si hubo error al refrescar el token, invalidamos la sesión
      if (token.error === "RefreshAccessTokenError") {
        console.error("Error en la sesión, no se pudo refrescar el token");
        session.error = token.error;
        session.accessToken = null;
        session.refreshToken = null;
        return session;
      }

      // Transferimos todos los datos del token a la sesión
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.idToken = token.idToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.refreshTokenExpires = token.refreshTokenExpires;
      session.tokenType = token.tokenType;
      session.notBeforePolicy = token.notBeforePolicy;
      session.sessionState = token.sessionState;
      session.scope = token.scope;
      session.user = {
        id: token.id,
        name: token.name,
        preferred_username: token.preferred_username,
        given_name: token.given_name,
        family_name: token.family_name,
        email: token.email,
        username: token.username,
      };

      // console.log("Sesión actualizada:", session);

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

async function refreshAccessToken(token: any) {
  // console.log("Intentando refrescar el access token");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // console.log("Respuesta del servidor al refrescar el token:", response.data);

    const refreshedTokens = response.data;

    // console.log("Tokens actualizados tras el refresco:", {
    //   accessToken: refreshedTokens.access_token,
    //   refreshToken: refreshedTokens.refresh_token,
    //   idToken: refreshedTokens.id_token,
    //   expiresIn: refreshedTokens.expires_in,
    //   refreshExpiresIn: refreshedTokens.refresh_expires_in,
    // });

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      refreshTokenExpires:
        Date.now() + refreshedTokens.refresh_expires_in * 1000,
      idToken: refreshedTokens.id_token,
      tokenType: refreshedTokens.token_type,
      notBeforePolicy: refreshedTokens["not-before-policy"],
      sessionState: refreshedTokens.session_state,
      scope: refreshedTokens.scope,
    };
  } catch (error) {
    console.error("Error refrescando el access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
