//'use strict';
    let REPOS = [];
    let CONTRIBUTORS = [];
    let SELECTED_REPO_INDEX = -1;

    function createAndAppend(name, parent, options = {}) {
      const elem = document.createElement(name);
      parent.appendChild(elem);
      Object.keys(options).forEach((key) => {
        const value = options[key];
        if (key === 'html') {
          elem.innerHTML = value;
        } else {
          elem.setAttribute(key, value);
        }
      });
      return elem;
    }

    async function onSelectRepo(e) {
      const name = e.target.value;
      SELECTED_REPO_INDEX = REPOS.findIndex(repo => repo.name === name);
      const repo = REPOS[SELECTED_REPO_INDEX];
      const res = await fetch(repo.contributors_url);
      const json = await res.json();
      CONTRIBUTORS = json;
      update();
    }

    function update() {
      const $root = document.querySelector('#root');
      $root.innerHTML = ' ';
      const $select = createAndAppend('select', $root);
      $select.addEventListener('change', onSelectRepo);

      for (const repo of REPOS) {
        const $option = createAndAppend('option', $select, { html: repo.name });
      }

      if (SELECTED_REPO_INDEX >= 0) {
        const repo = REPOS[SELECTED_REPO_INDEX];
        const repoUrl = `https:
        //github.com/hackyourfuture/${repo.name}`;

        const $haderDiv = createAndAppend('div', $root);
        $haderDiv.setAttribute('class', 'hader-div');

        let $wm = createAndAppend('div', $haderDiv);
        $wm.setAttribute('class', 'w');
        $wm.innerHTML = "HYF Repositories";

        const $mainDiv = createAndAppend('div', $root);
        $mainDiv.setAttribute('class', 'main');

        const $detailsDiv = createAndAppend('div', $mainDiv);
        $detailsDiv.setAttribute('class', 'child-main');

        const $ContributionsDiv = createAndAppend('div', $mainDiv);
        $ContributionsDiv.setAttribute('class', 'repo-Contributions');


        const $detailsList = createAndAppend('ul', $detailsDiv);
        $detailsList.setAttribute('class', 'repo-detailsList');

        const $detailsItem = createAndAppend('li', $detailsList);
        $detailsItem.setAttribute('class', 'repo-details');
        $detailsItem.innerHTML = "Repository : ";
        const $repoName1 = createAndAppend('a', $detailsItem, { href: repoUrl, html: repo.name });

        const $repoforks = createAndAppend('li', $detailsList);
        $repoforks.setAttribute('class', 'repo-details');
        $repoforks.innerHTML = "Forks : " + repo.forks_count;

        const $repoUpdate = createAndAppend('li', $detailsList);
        $repoUpdate.setAttribute('class', 'repo-details');
        $repoUpdate.innerHTML = "Updated : " + repo.updated_at;

        const $repoDescription = createAndAppend('li', $detailsList);
        $repoDescription.setAttribute('class', 'repo-details');
        $repoDescription.innerHTML = "Description : " + repo.description;

        const $contributorsDiv = createAndAppend('div', $root);
        $contributorsDiv.setAttribute('class', 'contributor');

        const $contributorsList = createAndAppend('ul', $contributorsDiv, { className: 'contributors-list' });

        for (contributor of CONTRIBUTORS) {
          const $contributorItem = createAndAppend('li', $contributorsList, { className: 'contributor' });
          const $contributorLogin = createAndAppend('p', $contributorItem, { className: 'contributor-login', html: contributor.login });
        }
      }
    }

    async function fetchRepos() {

      const res = await fetch('https://api.github.com/orgs/HackYourFuture/repos?per_page=100');
      const json = await res.json();
      console.log(json);
      REPOS = json;
      SELECTED_REPO_INDEX = 0;
      update();
    }

    fetchRepos();
