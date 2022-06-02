// Json and html values
let value = {};
let data2 = [];
let orgEl = "treasuryguild";
let repoEl = "treasury-v3";
let walletEl = "";
let fundJ = ""
let projectJ = ""
let ideaJ = ""
let poolJ = ""
let balEl = document.getElementById("bal-el")
let saveEl2 = document.getElementById("save-el2")
let saveEl = document.getElementById("save-el")


// Calc values
let balance = "";
const bi = [];
const totAv = [];
const budgetI = [];
const l = [];
let totals = {};
let totals2 = {};
const b = []
const x = []

window.onload = function() {
    axios.get(`https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/proposals/F8-Catalyst-Circle-Funding-Mechanism.json`)
        .then(response => {
        const data = response.data;
        console.log(data);
        totals2 = data.budgetItems;
        fundJ = ("Fund" + parseInt(data.fund.replace( /^\D+/g, '')));
        projectJ = data.project.replace(/\s/g, '-')
        ideaJ = data.ideascale
        poolJ = data.proposal.replace(/\s/g, '-')
        walletEl = data.wallet   
        balEl.textContent = "USD " + parseInt(data.budget).toFixed(2);
        console.log(data);
        // Loop over each object in data array
        let ul4 = document.getElementById('main-title');
        let li4 = document.createElement('div');
        li4.innerHTML = (poolJ + " Transaction Form");
        ul4.appendChild(li4);
        for ( let i in data.budgetItems) {
            // Get the ul with id of of userRepos
            var n = Object.keys(data.budgetItems).indexOf(i);
            totals[i] = 0;
            let ul = document.getElementById('grps');
            // Create variable that will create li's to be added to ul
            let li = document.createElement('div');   
            // Create the html markup for each li
            k = ("t" + `${n+1}`);
            l[i] = ("b" + `${n+1}`);
            li.className = "graph_item green";
            if (n > 1) {
            li.innerHTML = (`
            <span class="graph_item_title">
            <a href="https://github.com/${orgEl}/${repoEl}/tree/main/Transactions/${projectJ}/${fundJ}/${poolJ}/${i}" target="_blank">
            <span class="title" id=${k}>${i}</span>
            </a>
            </span>
            <span class="graph_item_value">
            <a href="https://github.com/${orgEl}/${repoEl}/tree/main/Transactions/${projectJ}/${fundJ}/${poolJ}/${i}" target="_blank">
            <span class="value" id=${l[i]}></span>
            </a>
            </span>
            `);
            }
            // Append each li to the ul
            ul.appendChild(li);
              
          }
          totals.outgoing = 0;
          
          axios.get(`https://api.github.com/repos/${orgEl}/${repoEl}/contents/Transactions/${projectJ}/${fundJ}/${poolJ}`)
          .then(response => {
            const data = response.data;
            for (let j in data) {
              budgetI[j] = data[j].name.replace(/\s/g, '-');
              axios.get(`https://api.github.com/repos/${orgEl}/${repoEl}/contents/Transactions/${projectJ}/${fundJ}/${poolJ}/${budgetI[j]}`)
              .then(response => {
                const data = response.data;
                for (let m in data) {    
                  axios.get(data[m].download_url)
                  .then(response => {
                    const data = response.data;
                    bi.push(data);
                  })
                  .catch(error => console.error(error))
                }      
              })
              .catch(error => console.error(error))   
              }          
          })
          .catch(error => console.error(error))
          axios.get(`https://pool.pm/wallet/${walletEl}`)
          .then(response => {
            for (let i in bi) {
              y = bi[i].budget.replace(/\s/g, '-')
              for (let j in budgetI) {    
                if ( y == budgetI[j]) {
                  totals[y] = totals[y] + (parseInt(bi[i].ada));
                  totals.outgoing = totals.outgoing + (parseInt(bi[i].ada));
                }        
              }
            };
            balance = (response.data.lovelaces/1000000).toFixed(2);
            saveEl2.textContent = "₳ " + balance
            document.getElementById("save-el2").style.width = (balance/data.budget*100)+"%"
            saveEl.textContent = "₳ " + totals.Incoming
            document.getElementById("save-el").style.width = (totals.Incoming/data.budget*100)+"%"
            for (let i in totals) {
              if (i != "Incoming" && i != "outgoing" && i != "Other") {
                totAv[i] = (totals.Incoming * 0.1866 - totals[i]).toFixed(2);
                if (i == "Unexpected-costs") {totAv[i] = (totals.Incoming * 0.0666 - totals[i]).toFixed(2);}
                b[i] = document.getElementById(l[i]);        
                x[i] = (totAv[i]/totals2[i]*100).toFixed(2);
                b[i].textContent = "₳ " + parseInt(totAv[i]).toFixed(2);   
                document.getElementById(`${l[i]}`).style.width = x[i]+"%"
            console.log(totals2[i]);
              }
            }
            console.log(totAv);
          })
          .catch(error => console.error(error))
          console.log(bi);
})
.catch(error => console.error(error))
};

