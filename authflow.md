Text goes here.

```js
// remix > app > routes > login.tsx

import type { LoaderFunction } from "remix";
import { redirect } from "remix";

export const loader: LoaderFunction = async ({
  request
}) => {
  return redirect(
    `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-private%20user-library-read`);
}
```

Text goes here. 

```graphql
// stepzen > spotify > spotify.graphql

type Spotify_Auth {
  access_token: String
  token_type: String
  expires_in: Int
  refresh_token: String
  scope: String
}

type Query {
  get_token_with_code(
    code: String!
  ): Spotify_Auth
    @rest(
      configuration: "spotify_config"
      method: POST
      contenttype: "application/x-www-form-urlencoded"
      endpoint: "https://accounts.spotify.com/api/token?code=$code&grant_type=authorization_code&redirect_uri=http://localhost:3000/callback"
      headers: [{
        name: "Authorization",
        value: "Basic $buffer"
      }]
    )
}
```

Text goes here.

```js
  // remix > app > routes > callback.tsx

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let res = await fetch(`${process.env.STEPZEN_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${process.env.STEPZEN_API_KEY}`
    },
    body: JSON.stringify({
      query: `
        query MyQuery($code: String!) {
          get_token_with_code(code: $code) {
            access_token
          }
        }`,
      variables: {
        code: code,
      },
    }),
  })
  let data = await res.json();
```


Text goes here.

```js
  // remix > app > routes > callback.tsx
  
  let token = data.data.get_token_with_code.access_token;
  const session = await getSession(
    request.headers.get("Cookie")
  );
  session.set("token", token)
  throw redirect(
    "/tracks",
    {
        headers: {
            'Set-Cookie': await commitSession(session),
        },
    }
```


Text goes here.


```js
// remix > app > routes > callback.tsx

export default function Callback() {
  return redirect('/tracks')
}
```

