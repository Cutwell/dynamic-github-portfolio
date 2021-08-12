$(document).ready(function() {
    getYAML();
});

// initialise vars for YAML //
var github = window.location.href.split(".")[0].split("//")[1];
var min_stars = 0;
var min_forks = 0;
var languages = "";
var display = -1;

function getYAML() {
    $.ajax({
        type: "GET",
        url: "config.yaml",
        timeout: 5000,
        success: function(yaml) { getYAMLcallback(yaml); },
        error: function(xhr, status, error) {
            console.log("config.yaml: ", xhr, status, error)

            $('#loading').css({"visiblity": "hidden", "display":"none"});
            $('#error-div').css("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: Failed to load 'config.yaml'</p>`
            $('#error-details').append(html);
        },
    });
}

function getYAMLcallback(yaml) { 
    // dirty and cheap YAML parser //
    // replace lines starting with # with empty text
    yaml = yaml.replace(/^[#;].*/g, "");

    // strip whitespace
    yaml = yaml.replace(/ /g, "");

    // split into lines
    yaml = yaml.split("\n");

    // iterate and extract key-value pairs
    for (let i = 0; i < yaml.length; i++) {
        keyvalue = yaml[i];
        keyvalue = keyvalue.split(":");
        key = keyvalue[0];
        value = keyvalue[1];

        // switch-case to set key-value pairs
        // (value === undefined) to catch empty yaml keys and set as defaults
        switch(key) {
            case "github":
                github = (value === undefined) ? github : value;
                break;
            case "min-starts":
                min_stars = (value === undefined) ? 0 : value;
                break;
            case "min-forks":
                min_forks = (value === undefined) ? 0 : value;
                break;
            case "languages":
                languages = (value === undefined) ? "" : value;
                break;
            case "display":
                display = (value === undefined) ? -1 : value;
            default:
                break;
        }
    }

    getGithub();
}

function getGithub() {
    // get user
    $.ajax({
        url: "https://api.github.com/users/"+github,
        timeout: 5000,
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function(data) { getGithubUsercallback(data); },
        error: function(xhr, status, error) {
            console.log("https://api.github.com/users/", github, ": ", xhr, status, error)

            $('#loading').css({"visiblity": "hidden", "display":"none"});
            $('#error-div').css("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: Request to ${"https://api.github.com/users/"+github} failed</p>`
            $('#error-details').append(html);
        },
        // monitor xhr to catch rate limit errors (not caught by error function)
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("error", function(evt){
                console.log("https://api.github.com/users/", github, ": ", xhr, status, error)

                $('#loading').css({"visiblity": "hidden", "display":"none"});
                $('#error-div').css("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: Request to ${"https://api.github.com/users/"+github} failed</p>`
                $('#error-details').append(html);
            }, false);
            xhr.addEventListener("abort", function(){
                console.log("https://api.github.com/users/", github, ": ", xhr, status, error)

                $('#loading').css({"visiblity": "hidden", "display":"none"});
                $('#error-div').css("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: Request to ${"https://api.github.com/users/"+github} failed</p>`
                $('#error-details').append(html);
            }, false);
    
            return xhr;
        },
    });

    // get repos
    $.ajax({
        url: "https://api.github.com/users/"+github+"/repos",
        timeout: 5000,
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function(data) { getGithubReposcallback(data) },
        error: function(xhr, status, error) {
            console.log("https://api.github.com/users/", github, "/repos: ", xhr, status, error)

            $('#loading').css({"visiblity": "hidden", "display":"none"});
            $('#error-div').attr("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: ${"https://api.github.com/users/"+github+"/repos"} failed</p>`
            $('#error-details').append(html);
        },
        // monitor xhr to catch rate limit errors (not caught by error function)
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("error", function(evt){
                console.log("https://api.github.com/users/", github, "/repos: ", xhr, status, error)

                $('#loading').css({"visiblity": "hidden", "display":"none"});
                $('#error-div').attr("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${"https://api.github.com/users/"+github+"/repos"} failed</p>`
                $('#error-details').append(html);
            }, false);
            xhr.addEventListener("abort", function(){
                console.log("https://api.github.com/users/", github, "/repos: ", xhr, status, error)

                $('#loading').css({"visiblity": "hidden", "display":"none"});
                $('#error-div').attr("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${"https://api.github.com/users/"+github+"/repos"} failed</p>`
                $('#error-details').append(html);
            }, false);
    
            return xhr;
        },
    });
}

function getGithubUsercallback(data) {
    if (Object.keys(data).includes('message')) {
        if (data['message'] == "Not Found") {
            console.log("User '", github, "' not found. Is `config.yaml` configured?")

            $('#error-div').attr("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: User '${github}' not found. Is 'config.yaml' configured?</p>`
            $('#error-details').append(html);
        }
    }
    else {
        $("#header-link").attr('href', data['html_url']);
        $("#header-image").attr('src', data['avatar_url']);
        $("#header-username").text(data["login"]);
        document.title = data["login"];
        $("#header-name").text(data["name"]);
        $("#header-bio").text(data["bio"]);
        $("#header-followers").text(data["followers"]);
        $("#header-public-repos").text(data["public_repos"]);
        
        if (data["company"] != "") {
            $("#header-company").text(data["company"]);
        }
        else {
            $("#header-company-div").hide();
            $("#header-company").hide();
        }
        
        if (data["blog"] != "") {
            $("#header-blog").text(data["blog"]);
            $("#header-blog").attr("href", data["blog"]);
        }
        else {
            $("#header-blog-div").hide();
            $("#header-blog").hide();
        }
    
        if (data["email"] != null) {
            $("#header-email").text(data["email"]);
        }
        else {
            $("#header-email-div").hide();
            $("#header-email").hide();
        }
        
        if (data["hireable"]) {
            $("#header-hireable").show();
        }
        else {
            $("#header-hireable").hide();
        }

        $('#loading').css({"visiblity": "visible"});
        $('#loading').css({"visiblity": "hidden", "display":"none"});
    }
}

function getGithubReposcallback(data) {
    if (Object.keys(data).includes('message')) {
        if (data['message'] == "Not Found") {
            console.log("User '", github, "' not found. Is `config.yaml` configured?")

            $('#error-div').attr("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: User '${github}' not found. Is 'config.yaml' configured?</p>`
            $('#error-details').append(html);
        }
    }

    data.sort(function(a, b) {
        return Date.parse(a.updated_at) - Date.parse(b.updated_at);
    })
    data.reverse();

    // reduce repository list to display limit
    if (display > -1) {
        // set length of array to delete data past index.
        data.length = display;
    }

    // filter repository list, removing repositories that do not meet filter criteria
    // as defined by config.yaml

    // must iterate .map twice, as spider processes wait on previous indexes to return before adding content
    // to the DOM, meaning rejection must occur seperately to prevent deadlock.
    let filtered = data.filter(function(repo) {
        // filter by repo >= minimum stars
        // filter by repo >= minimum forks
        // filter by inclusion in languages list (if empty, all are included)
        if (repo['stargazers_count'] >= min_stars 
            && repo['forks_count'] >= min_forks 
            && (languages.includes(repo['languages']) || languages == "")) {
            return true;
        }
        else {
            return false;
        }
    });

    filtered.map((repo, index) => {
        // spawn individual spiders for each repository
        // each process returns an image for use as a thumbnail

        let url = repo['url']+"/contents/";
        thumbnailShallowSearch(repo, index, url, new Array())
    });
}

function thumbnailShallowSearch(repo, index, url) {
    $.ajax({
        // assume url passed is formatted for root dir
        url: url,
        timeout: 5000,
        success: function(contents) {
            let images = contents.filter(function(item) {
                if (item['name'].includes(".png") && item['type'] == "file") {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (images.length == 0) {
                // if no images found in this dir, use default image
                composeGitHubCardcallback(repo, "static/img/GitHub-Mark-120px-plus.png", index);
            }
            else {
                // if images are found, use first discovered
                let image = images[0];
                composeGitHubCardcallback(repo, image['download_url'], index);
            }
        },
        error: function(xhr, status, error) {
            console.log(repo['url'], "/contents/:", xhr, status, error)

            $('#error-div').attr("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: ${error}</p>`
            $('#error-details').append(html);
        },
        // monitor xhr to catch rate limit errors (not caught by error function)
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("error", function(evt){
                console.log(repo['url'], "/contents/:", xhr, status, error)

                $('#error-div').attr("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${error}</p>`
                $('#error-details').append(html);
            }, false);
            xhr.addEventListener("abort", function(){
                console.log(repo['url'], "/contents/:", xhr, status, error)

                $('#error-div').attr("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${error}</p>`
                $('#error-details').append(html);
            }, false);
    
            return xhr;
        },
    });
}

function thumbnailBreadthFirstSearch(repo, index, url, dirs) {
    $.ajax({
        // assumes initial url passed is formatted for root dir
        url: url,
        timeout: 5000,
        success: function(contents) {
            let images = contents.filter(function(item) {
                if (item['name'].includes(".png") && item['type'] == "file") {
                    return true;
                }
                else {
                    return false;
                }
            });

            let directories = contents.filter(function(item) {
                if (item['type'] == "dir") {
                    return true;
                }
                else {
                    return false;
                }
            });

            let dir_urls = new Array();
            if (directories.length != 0) {
                // if directories discovered, append them to 'dirs' for viewing
                dir_urls = directories.map(dir => dir.url);
            }

            dirs = dirs.concat(dirs, dir_urls);

            if (images.length == 0) {
                // if no images found in this dir
                if (dirs.length == 0) {
                    // if no further directories to view, use default image
                    composeGitHubCardcallback(repo, "static/img/GitHub-Mark-120px-plus.png", index);
                }
                else {
                    // recurse, using a dir from dirs
                    let nextUrl = dirs.shift();
                    thumbnailSearch(repo, index, nextUrl, dirs);
                }
            }
            else {
                // if images are found, use first discovered
                let image = images[0];
                composeGitHubCardcallback(repo, image['download_url'], index);
            }
        },
        error: function(xhr, status, error) {
            console.log(repo['url'], "/contents/:", xhr, status, error)

            $('#error-div').attr("visibility", "visible");
            let html = `<p class="error-em">${Date.now()}: ${error}</p>`
            $('#error-details').append(html);
        },
        // monitor xhr to catch rate limit errors (not caught by error function)
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.addEventListener("error", function(evt){
                console.log(repo['url'], "/contents/:", xhr, status, error)

                $('#error-div').attr("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${error}</p>`
                $('#error-details').append(html);
            }, false);
            xhr.addEventListener("abort", function(){
                console.log(repo['url'], "/contents/:", xhr, status, error)

                $('#error-div').attr("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${error}</p>`
                $('#error-details').append(html);
            }, false);
    
            return xhr;
        },
    });
}

async function sleepUntil(f, timeoutMs, repo_name) {
    return new Promise((resolve, reject) => {
        let timeWas = new Date();
        let wait = setInterval(function() {
            if (f()) {
                console.log("resolved after", new Date() - timeWas, "ms");
                clearInterval(wait);
                resolve();
            } else if (new Date() - timeWas > timeoutMs) { // Timeout
                let ms_reject = new Date() - timeWas;

                console.log(`${repo_name} did not resolve within ${ms_reject}ms`)
                $('#error-div').css("visibility", "visible");
                let html = `<p class="error-em">${Date.now()}: ${repo_name} did not resolve within ${ms_reject}</p>`
                $('#error-details').append(html);

                clearInterval(wait);
                reject();
            }
        }, 20);
    });
}

async function composeGitHubCardcallback(repo, image_download_url, index) {
    let html = `<div class="embed">
        <a href="${repo['html_url']}"
            class="embed-link"
            title="${repo['html_url']}">
            <strong class="embed-strong">GitHub - ${repo['full_name']}</strong>
            <br>
            <em class="embed-em">${repo['description']}</em>
            <em class="embed-em">
                <span name="language" class="embed-language">${repo['language']}</span>
                <span name="watchers" class="embed-span">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
                        <path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                    <span>${repo['watchers_count']}</span>
                </span>
                
                <span name="stargazers" class="embed-span">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
                        <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                    </svg>
                    <span>${repo['stargazers_count']}</span>
                </span>
                
                <span name="forks" class="embed-span">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true">
                        <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                    </svg>
                    <span>${repo['forks_count']}</span>
                </span>
            </em>
        </a>
        <a href="${repo['html_url']}"
            class="embed-image"
            style="background-size: 80%; background-image: url(${image_download_url});">
        </a>
    </div>`;

    if (index == 0) {
        $('#repos').append(html);
    }
    else {
        // await previous repos resolving
        await sleepUntil(() => document.querySelector(`#repos div:nth-child(${index})`), 5000, repo['html_url']);

        $(`#repos div:nth-child(${index})`).after(html);
    }
    
    $('#loading').css({"visiblity": "hidden", "display":"none"});
}