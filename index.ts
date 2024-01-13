import { createServer } from "http";
import app from "./src/app";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import mongoose from "mongoose";
const { decode, sign, verify } = require("jsonwebtoken");
import { expressMiddleware } from "@apollo/server/express4";
import {} from "graphql";
import dotenv from "dotenv"
dotenv.config({
});
// const { makeExecutableSchema } = require("@graphql-tools/schema");
(async function startServer() {
  const httpServer = createServer(app);
  /*   const apolloServer = new ApolloServer({
    schema: {} as any,
    // typeDefs,

    // resolvers,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: httpServer as any }),
      ApolloServerPluginLandingPageLocalDefault(),
    ],
  });
  await apolloServer.start(); */

  mongoose
    .connect("mongodb+srv://wyvernp:WyvernP2506@coalition-lang.5wjkafv.mongodb.net/?retryWrites=true&w=majority", { dbName: "coalition-lang" })
    .then(() => {
      console.log("mongodb connection established");

      httpServer.listen(5551, () => {
        console.log("app is listening at http://localhost:5551");
      });
    })
    .catch((err) => console.log("mongodb connection error: " + err.message));
})();
