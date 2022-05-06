import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { getSession } from "../sessions";

export async function getUserInfo(token: String) {
  let res = await fetch(`${process.env.STEPZEN_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${process.env.STEPZEN_API_KEY}`
    },
    body: JSON.stringify({
      query: `
        query MyQuery($access_token: String!) {
          get_user_info(access_token: $access_token) {
            display_name
            id
          }
      }`,
      variables: {
        access_token: token,
      },
    }),
  })
  let data = await res.json();
  // console.log('data in function: ', data);
  let userInfo = data.data.get_user_info;
  // console.log('userInfo in function', tracks);
  return userInfo;
}

export const loader: LoaderFunction = async ({ 
  request 
}) => {
  const session = await getSession(
    request.headers.get("Cookie")
    );
  const token = session.get("token") || null;
  console.log('token: ', token)
  let userInfo = await getUserInfo(token);
  return userInfo
}

export default function User() {
  const userInfo = useLoaderData();
  console.log(userInfo)
  return (
    <ul>
      {userInfo.display_name}
    </ul>
  )
}