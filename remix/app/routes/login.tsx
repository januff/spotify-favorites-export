import type { LoaderFunction } from "remix";
import { redirect } from "remix";


export const loader: LoaderFunction = async ({
  request
}) => {
  // handle "GET" request
  return redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-private%20user-library-read`);
}