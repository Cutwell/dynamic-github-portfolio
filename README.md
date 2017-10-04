# Dynamic Pages
An 100% automated GitHub pages tool.

#### [Live example](https://cutwell.github.io)

### How to use this repository
1. Fork this repository, or manually copy the files into your GitHub pages repository.
2. Done! Your webpage should now be served from your regular GitHub pages web address.

### Contributions
Found a language not included in lang.css? Make a pull-request!

### Setting Ajax requests manually
If you intend to host this website on a none-GitHub domain, you will need to set the Ajax requests manually.
1. Open git.js
2. delete the top line:
```javascript
var url = window.location.href.split(".")[0];
```
3. replace it with this:
```javascript
var url = "__YOUR_USER_NAME__";
```
Where __YOUR_USER_NAME__ is your GitHub user name.

4. Repeat for user.js
