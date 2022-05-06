import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { getSession } from "../sessions";

export async function getTracks(token: String, cursor: String = '') {
  let res = await fetch(`${process.env.STEPZEN_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${process.env.STEPZEN_API_KEY}`
    },
    body: JSON.stringify({
      query: `
        query MyQuery($access_token: String!, $after: String!) {
          get_saved_tracks(access_token: $access_token, after: $after) {
            edges {
              node {
                added_at
                artist_id
                artist_name
                isrc
                popularity
                preview_url
                track_id
                track_name
              }
              cursor
            }
            pageInfo {
              endCursor
              hasNextPage
              hasPreviousPage
              startCursor
            }
          }
      }`,
      variables: {
        access_token: token,
        after: cursor
      },
    }),
  })
  let data = await res.json();
  // console.log('data in function: ', data);
  let tracks = data.data.get_saved_tracks;
  // console.log('tracks in function', tracks);
  return tracks;
}

export const loader: LoaderFunction = async ({ 
  request 
}) => {
  const session = await getSession(
    request.headers.get("Cookie")
    );
  const token = session.get("token") || null;
  // console.log('token: ', token)
  let tracks = await getTracks(token);
  // console.log('tracks in loader: ', tracks);
  let edges = tracks.edges;
  // console.log('edges in loader: ', edges.length);
  let endCursor = tracks.pageInfo.endCursor;
  // console.log('endCursor in loader: ', endCursor);
  let hasNextPage = tracks.pageInfo.hasNextPage;
  while (hasNextPage){
    // console.log('endCursor: ', endCursor);
    let moreTracks = await getTracks(token, endCursor)
    let moreEdges = moreTracks.edges;
    // console.log('moreEdges in loader: ', moreEdges.length);
    Array.prototype.push.apply(edges, moreEdges);
    console.log('edges after push ', edges.length);
    let moreNext = moreTracks.pageInfo.hasNextPage;
    // console.log('moreEdges in loader: ', moreEdges.length);
    let moreCursor = moreTracks.pageInfo.endCursor;
    // console.log('moreCursor in loader: ', moreCursor)
    endCursor = moreCursor;
    hasNextPage = moreNext;
    ;
  }
  return edges;
}

export default function Tracks() {
  const edges = useLoaderData();
  // console.log(edges)
  const tracks = edges?.map((track, i) =>
    <li key={i}>
      {track.node.artist_name}, “{track.node.track_name}”
       <br></br>
       <audio 
          controls
          src={track.node.preview_url}>
       </audio>
    </li>
  );
  
  return (
    <ul>
      {tracks}
    </ul>
  )
}