'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository.
   */
  render(parent) {
    const labelNames = ['name', 'description', 'forks_count', 'updated_at'];
    labelNames.forEach(labelName => {
      const p = Util.createAndAppend('div', parent, {
        class: 'Repo'
      });
      const z = translate(labelName);
      if (z === 'Name :') {
        Util.createAndAppend('label', p, {
          html: z,
          class: 'Tlabel'
        });
        Util.createAndAppend('a', p, {
          html: this.data[labelName],
          href: this.data.html_url,
          target: '_blank',
          class: 'repo-link'
        });
      } else {
        Util.createAndAppend('label', p, {
          html: z,
          class: 'Tlabel'
        });
        Util.createAndAppend('span', p, {
          html: this.data[labelName],
          class: 'labelN'
        });
      }
    });
    //
    // Replace this comment with your code
    //
  }

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.data.name;
  }
}
const dictionary = {
  forks_count: 'Forks :',
  name: 'Name :',
  description: 'Description :',
  updated_at: 'Update :'
};

function translate(labelName) {
  const reqLabel = dictionary[labelName];
  return reqLabel;
}
