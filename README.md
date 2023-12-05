## Getting Started

First, install dependencies

```bash
yarn install
```

Then you'll need to point the app to a mongo database. The app was developed using Mongo Atlas, you can register for a free account [here](https://www.mongodb.com/cloud/atlas/register).

- Once you sign up for an account, click "Build a database".
- Select M0 for a free tier of storage. This will suffice for our game! Click create.
- On the Security Quickstart landing page, you'll need to create a user. Note down (or change) the password. You'll need it later. Click "Create User".
- The "Where would you like to connect from?" section should default to your local IP. To accept this click "Finish and close".
- You should then be able to see your database cluster by clicking "Database" in the left-hand nav menu. From the Database view, click "Connect".
- Select the first option "Drivers", and you should see a connection URL in step 3 of the following screen. Copy that and replace <password> with your User password. (Note: you should get rid of the query params so that your URL structure is as follows: `mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.<CLUSTER-HASH>.mongodb.net/tic-tac-toe`)
- Create a file at the root of the project called `.env` and paste the updated URL:

```
DATABASE_URL="<MONGO-URL>"
```

- Go back to the mongo dashboard and close the "Connect" modal, then click "Browse Collections".
- From here, select "Add My Own Data" and give your database and collection the name "tic-tac-toe".

Now you should be able to run `npx prisma generate` at the root of the project, and run it with `yarn dev`

## Testing the game

This game uses socket.io to send players' moves/actions to other players. To test this game, you should open two browsers (at least one as incognito).
One browser can create a game and copy the game code, and the other can paste the game code and join the game. Have fun playing the game! Remember to view the leaderboards by clicking the icon in the header!
