Text goes here. 

```graphql
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

```graphql
type Track {
  added_at: String
  track_id: String
  track_name: String
  artist_id: String
  artist_name: String
  popularity: Int
  preview_url: String
  isrc: String
}

type TrackEdge {
  node: Track
  cursor: String
}

type TrackConnection {
  pageInfo: PageInfo!
  edges: [TrackEdge]
}

type Query {
  get_saved_tracks(
    access_token: String!
    first: Int! = 50
    after: String! = ""
  ): TrackConnection
    @rest(
      endpoint: "https://api.spotify.com/v1/me/tracks?limit=$first&offset=$after"
      headers: [{
        name: "Authorization",
        value: "Bearer $access_token"
      }]
      resultroot: "items[]"
      pagination: {
        type: OFFSET
        setters: [{field:"total", path: "total"}]
      }
      setters: [
        { field: "track_id", path: "track.id" }
        { field: "track_name", path: "track.name" }
        { field: "artist_id", path: "track.artists[].id" }
        { field: "artist_name", path: "track.artists[].name" }
        { field: "popularity", path: "track.popularity" }
        { field: "preview_url", path: "track.preview_url" }
        { field: "isrc", path: "track.external_ids.isrc" }
      ]
    )
}
```