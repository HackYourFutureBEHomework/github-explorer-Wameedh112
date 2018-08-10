'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    // Add code here to initialize your app
    // 1. Create the fixed HTML elements of your page
    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element

    const root = document.getElementById('root');
    const header = Util.createAndAppend("header", root, {
      class: "header",
      html: "<h4>HYF Repositories</h4>"
    });
    const repositorySelect = Util.createAndAppend("select", header, {
      class: "select"
    });

    Util.createAndAppend("option", repositorySelect, {
      class: "option",
      html: "*** Select the repositry ***",
    });

    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.sort((url, repos) => url.name.localeCompare(repos.name)).map(repo => new Repository(repo));

      this.repos.forEach((repo, i) => {
        Util.createAndAppend("option", repositorySelect, {
          class: "option",
          html: repo.name(),
          value: i
        });
      });

      repositorySelect.addEventListener("change", () => this.fetchContributorsAndRender(repositorySelect.value));
      Util.createAndAppend("div", root, {
        class: "container"
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    const repo = this.repos[index],
      container = document.querySelector('.container');

    try {

      const contributors = await repo.fetchContributors();

      // Erase previously generated inner HTML from the container div
      container.innerHTML = '';

      const infoRepos = Util.createAndAppend('div', container, {
        class: 'info_repo'
      });
      const info_con = Util.createAndAppend('div', container, {
        class: 'info_con'
      });
      Util.createAndAppend('p', info_con, {
        html: 'Contributions', class: 'contributor-header'
      });
      const contributorList = Util.createAndAppend('ul', info_con, {
        class: 'repo_list'
      });

      repo.render(infoRepos);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    const container = document.querySelector(".container");
    container.innerHTML = "",
      Util.createAndAppend("div", container, {
        html: error.message, class: 'alert-error'
      });
    // Replace this comment with your code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
