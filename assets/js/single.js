var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

getRepoName();

function getRepoIssues(repo) {
  var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  // make a get request to url
  fetch(apiURL).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayIssues(data);

        // check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      // if not successful, redirect to homepage
      document.location.replace("./index.html");
    }
  });
}

function displayIssues(issues) {
  // check for no issues, display message
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  // loop over response data and create an <a> element for each issue
  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // create span to hold issues title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);

    // append to the dom
    issueContainerEl.appendChild(issueEl);
  }
}

function displayWarning(repo) {
  // add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  // create link element and append link,
  // with an href attribute that points to github/repos{owner}/{repo}/issues
  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on Github.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
}

function getRepoName() {
  // grab repo name from url query string
  var queryString = document.location.search;
  var repoName = queryString.split("=")[1];

  // check if repoName exists, if not redirect back to homepage
  if (repoName) {
    // pass getRepoIssue() the string of query search
    getRepoIssues(repoName);
    repoNameEl.textContent = repoName;
  } else {
    // redirect back to homepage ~ index.html
    document.location.replace("./index.html");
  }
}
