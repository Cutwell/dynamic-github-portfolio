# Dynamic GitHub Portfolio
Automated and easy portfolio page for GitHub.

## GitHub Pages hosting
If hosting this template for a GitHub Pages repository, then the page will detect the target user from the domain name.

## Self hosting
If hosting this template for a custom domain name, a none-GitHub Pages server, or wish to display the portfolio of a different account, then update the `username` variable in `config.yaml` to your username.

## Features
* 100% automatic, works out-of-the-box.
* Display all your github repositories automatically.
* Attractive rendering, copying GitHub's own style.
* Customise displayed repositories using `config.yaml`.

## YAML config
| YAML markup | Function | Options |
|---|---|---|
| github | Set GitHub account target | Any valid GitHub username (default / undefined: username extracted from domain name, GitHub Pages only) |
| min-stars | Set minimum star requirement to feature a repository | Any valid integer (default / undefined: no minimum requirement) |
| min-forks | Set minimum forks requirement to feature a repository | Any valid integer (default / undefined: no minimum requirement) |
| languages | Filter repositories to only display projects written in e.g.: Python | Any language, case-sensitive to GitHub repository-languages stat. Only filtered by most dominant language per repository. Define multiple languages by creating an array. (default / undefined: no language filter) |
| display | Limit number of displayed repositories to N most recent (useful to reduce API calls for accounts with large number of public repositories) | Any valid integer (default / undefined: no repository limit) |

## API Rate Limiting
For unauthenticated requests / apps, users are limited to 60 requests per hour. This is limited based on IP address.

In order to reduce this, repository data (any extracted thumbnail images, etc.) are cached for up to a day. A minimum of two API calls are made per page load, to update the user profile card, and to update the cached repository data if necessary.

If your page is rate limiting, then consider reducing the number of repositories displayed using the `display` limit in `config.yaml`. 

### API call breakdown
The app will make a minimum of two API requests per page load.
1. To the user profile API, to update the cached user profile data.
2. To the repository list API, to determine if any repository has been created / updated since the cache was created.

During the initial page load (a new initial page load occurs 24 hours after the last cache update), the app with make content requests to each repository (not excluded by `config.yaml`) to extract e.g.: the thumbnail image.

Subsequent page loads within the cache lifetime will make two API calls per page load, in order to update the user profile cache and repository data cache. The user profile data is recached each page load. The repository data cache is compared with the received repository data, and new content requests are made for each individual repository that has been updated since the cache was created.

## License
MIT