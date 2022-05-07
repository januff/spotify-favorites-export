## How Portable Is Spotify?
### Exporting My Saved Music

During the recent Spotify controversies, the ease with which one could transfer Spotify playlists to competing services came up a lot–but I was disappointed to discover, when I tried to migrate my playlists to Tidal, that the free versions of both recommended transfer apps have 250-song restrictions.

I was disappointed to discover, when I tried to migrate my playlists to Tidal, that the free versions of both recommended transfer apps have 250-song restrictions–and the paid versions are subscription apps. Given a choice, I'd rather not enroll in a monthly subscription to a (likely) single-use app.

Make no mistake: for you it'll be super-convenient–assuming you're comfortable with React and at least curious about Remix–since I've reduced the process to just a few steps below (and offer you an easily cloneable repo to mod as you please.) 

But it wasn't horribly inconvenient for me, either–credit mainly to Brittany Chiang, whose recent newline.co course Build a Spotify Connect App (free online at the moment) is a concise masterclass in best practices for REST API client-building. (And whose code and architecture I'll be replicating as much as possible.)

In particular, Chiang walks us through best practices for two of the trickier prerequisites to robust API exploitation: building out an Authorization Code OAuth flow and masterminding a complex, multi-part API query. Fortuitously the same major operations of this playlist migration app! 

The two noteworthy modifications we'll be making to Brittany's code will be 1. adapting the OAuth flow to use Remix's routing and 2. orchestrating the multiple API calls for user info with StepZen rather than Axios (and focusing our query on playlist data.)