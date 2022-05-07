Text goes here.

```js
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
export default function Callback() {
  return redirect('/tracks')
}
```