'use strict';

{
    
    function fetchJSON(url) { 
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open("GET", url);
              xhr.onload = () => {
                if (xhr.status === 200) {
                  resolve(xhr.responseText);
                } else {
                  reject(xhr.responseText);
                }
              }
              xhr.onerror = () => reject('404 Server Error');
              xhr.send();
            });
          }

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

    function main(url) {
            fetchJSON(url).then(JSON.parse).then(data => {   

                const header = createAndAppend('div', root, {class: 'header'});
                createAndAppend('label', header, {html: 'HYF repositories'});
                const repositorySelect = createAndAppend('select', header);
                data.forEach(repo => {
                    createAndAppend('option', repositorySelect, {html: repo.name});
                });

                const left = createAndAppend('div', root, {class: 'left'});
                const right = createAndAppend('div', root, {class: 'right'});

                repositorySelect.addEventListener('change', (event) => {
                    let repo = data.find(r => r.name === repositorySelect.value);
                    left.innerHTML = '';
                    right.innerHTML = '';
                    renderRepo(left, repo);
                    renderContributors(right, repo);
                });

                const repo = data[0];
                renderRepo(left, repo);
                renderContributors(right, repo);
            
        });
    }

    function renderRepo(parent, repo) {
        const labelNames = ['name', 'url'];
        labelNames.forEach(labelName => {
            const p = createAndAppend('p', parent);
            createAndAppend('label', p, {html: labelName});
            createAndAppend('span', p, {html: repo[labelName]});
        });
    }

    function renderContributors(parent, repo) {
        const url = repo.contributors_url;
        fetchJSON(url ).then(JSON.parse).then(contData => {
         
                contData.forEach(contributor => {
                    const contributorDiv = createAndAppend('div', parent);
                    createAndAppend('img', contributorDiv, {src: contributor.avatar_url})
                });
console.log(contData);   

    }).catch(err => document.getElementById('root').innerHTML = err);
    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);
}
