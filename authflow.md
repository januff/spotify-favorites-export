The first step in Spotify's Auth flow requires you to redirect the user to Spotify, after which Spotify will redirect the user right back to you, along with a code. 

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

We need to exchange the code Spotify sends back for an <code>access_token</code>, the first of several interactions we'll be typing and refining using StepZen.

This step of authentication is the first (and only) that requires Basic Authentication, rather than the more commmon Bearer Authentication, and which 
therefore demands a base64-encoded ID/password pair in its Authorization header, an invariant string value I store in my StepZen config.

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

In the Loader for my <code>/callback</code>, I grab the <code>code</code> from the url and query an access token using the Fetch API.

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


That token is immediately extracted, set as a Cookie using <code>getSessions</code>, and persisted server-side using <code>commitSession</code>.

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

Which will make the <code>access_token</code> subsequently available to the loader at my <code>/tracks</code> route, to which we can redirect immediately

```js
// remix > app > routes > callback.tsx

export default function Callback() {
  return redirect('/tracks')
}
```

