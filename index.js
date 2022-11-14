// Json and html values
let value = {};
let data2 = [];
let orgEl = "treasuryguild";
let repoEl = "treasury-system-v4";
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
let totals3 = {};
const b = []
const x = []

let topData = {};
let topData2 = {};

const loaderContainer = document.querySelector('.loader');
const dataContainer = document.querySelector('.main');

const displayLoading = () => {
  loaderContainer.style.display = 'block';
  dataContainer.style.display = 'none';
};

const hideLoading = () => {
  loaderContainer.style.display = 'none';
  dataContainer.style.display = 'block';
};

window.onload = function() {
  displayLoading();
    axios.get(`https://raw.githubusercontent.com/${orgEl}/${repoEl}/main/proposals/F8-Catalyst-Circle-Funding-Mechanism.json`)
        .then(response => {
        const data = response.data;
        topData = response.data;
        console.log(data);
        totals2 = data.budgetItems;
        fundJ = ("Fund" + parseInt(data.fund.replace( /^\D+/g, '')));
        projectJ = data.project.replace(/\s/g, '-')
        ideaJ = data.ideascale
        poolJ = data.proposal.replace(/\s/g, '-')
        walletEl = data.wallet   
        balEl.textContent = "USD " + parseFloat(data.budget).toFixed(2);
        console.log(data);
        // Loop over each object in data array
        
        for ( let i in data.budgetItems) {
            // Get the ul with id of of userRepos
            var n = Object.keys(data.budgetItems).indexOf(i);
            totals[i] = 0;
            totals3[i] = 0;
            let ul = document.getElementById('grps');
            // Create variable that will create li's to be added to ul
            let li = document.createElement('div');   
            // Create the html markup for each li
            k = ("t" + `${n+1}`);
            l[i] = ("b" + `${n+1}`);
            li.className = "graph_item green";
            if (n > 2) {
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
          totals3.outgoing = 0;
          
          async function downloadFromDownloadURLs(url) {
            const {data} = await axios.get(url);
            const downloadedData = [];
            for (let key in data) {
              let downloadUrl = data[key].download_url;
              const downloadResponse = await axios.get(downloadUrl);
              downloadedData.push(downloadResponse.data);
            }
            return downloadedData;
          }
          
          async function loadData(orgEl, repoEl, projectJ, fundJ, poolJ) {
            let prefixUrl = `https://api.github.com/repos/${orgEl}/${repoEl}/contents/Transactions/${projectJ}/${fundJ}/${poolJ}`;
            const {data} = await axios.get(prefixUrl);
            for (let dataKey in data) {
              const budget = data[dataKey].name.replace(/\s/g, '-');
              budgetI[dataKey] = data[dataKey].name.replace(/\s/g, '-');
              const url = `${prefixUrl}/${budget}`;
              for (const downloadedData of await downloadFromDownloadURLs(url)) {
                bi.push(downloadedData);
              }
            }
            console.log('data', bi)
            return bi;
          }

          async function walletStatus() {
            const {data} = await axios.get(`https://pool.pm/wallet/${walletEl}`)
            
            topData2 = data;
            balance = (topData2.lovelaces/1000000).toFixed(6);
            
          }


          async function getWallet() {
            await walletStatus();
            await loadData(orgEl, repoEl, projectJ, fundJ, poolJ);
            hideLoading();
            let bulkB = "bulkTransactions"
            totals[bulkB] = 0;
            let bulkADA = 0;
            for (let i in bi) {
              if (bi[i].mdVersion) {   ///This is pulling data from new version "bulk" or single "Budget items"
                for (let k in bi[i].contributions) {
                  q = bi[i].contributions[k].label.replace(/\s/g, '-')
                  if (q == 'CC-Bounties' || q == 'Swarm-bounties') {
                    q = 'Stake-Pool-Operators'
                  }
                for (let j in budgetI) {  
                  console.log('q',q) 
                  if ( q == budgetI[j]) {
                  if ( bi[i].contributions[k].label !== "Incoming") {  
                    for (let m in bi[i].contributions[k].contributors) {
                      if (bi[i].contributions[k].contributors[m].ADA) {
                        bulkADA = (parseFloat(bi[i].contributions[k].contributors[m].ADA?bi[i].contributions[k].contributors[m].ADA:0));
                      } else if (bi[i].contributions[k].contributors[m].ada) {
                        bulkADA = (parseFloat(bi[i].contributions[k].contributors[m].ada?bi[i].contributions[k].contributors[m].ada:0));
                      } else { bulkADA = 0 }
                      totals[q] = totals[q] + bulkADA;
                      totals.outgoing = totals.outgoing + bulkADA;
                  }
                  } else if ( bi[i].contributions[k].label == "Incoming") {
                    for (let m in bi[i].contributions[k].contributors) {
                      if (bi[i].contributions[k].contributors[m].ADA) {
                        bulkADA = (parseFloat(bi[i].contributions[k].contributors[m].ADA?bi[i].contributions[k].contributors[m].ADA:0));
                      } else if (bi[i].contributions[k].contributors[m].ada) {
                        bulkADA = (parseFloat(bi[i].contributions[k].contributors[m].ada?bi[i].contributions[k].contributors[m].ada:0));
                      } else { bulkADA = 0 }
                      totals[bi[i].contributions[k].label] = totals[bi[i].contributions[k].label] + bulkADA;       
                  }
                  }  
                }     
                }
              }
              } else {
                y = bi[i].budget.replace(/\s/g, '-')    // THis is pulling data from old metadata
                for (let j in budgetI) {    
                  if ( y == budgetI[j]) {
                    if (y !== 'bulkTransactions') {
                      totals[y] = totals[y] + (parseFloat(bi[i].ada));
                      totals3[y] = totals3[y] + (parseFloat(bi[i].ada) * ((bi[i].exchangeRate === undefined) || isNaN(parseFloat((bi[i].exchangeRate).match(/\b\d+(?:.\d+)?/))) ? 0.5 : parseFloat((bi[i].exchangeRate).match(/\b\d+(?:.\d+)?/))));
                      if (y !== 'Incoming') {
                        totals.outgoing = totals.outgoing + (parseFloat(bi[i].ada));
                        totals3.outgoing = totals3.outgoing + ((parseFloat(bi[i].ada).toFixed(2)) * ((bi[i].exchangeRate === undefined) || isNaN(parseFloat((bi[i].exchangeRate).match(/\b\d+(?:.\d+)?/))) ? 0.5 : parseFloat((bi[i].exchangeRate).match(/\b\d+(?:.\d+)?/))));
                      }
                    }
                  }        
                }
              }
            };
            console.log("totals.outgoing",totals.outgoing)
            
            saveEl2.textContent = "₳ " + balance
            document.getElementById("save-el2").style.width = (balance/totals.Incoming*100)+"%"
            saveEl.textContent = "USD " + (totals3.Incoming).toFixed(2) + " ( ₳ " + totals.Incoming.toFixed(2) + " )";
            document.getElementById("save-el").style.width = (totals3.Incoming/topData.budget*100)+"%"
            for (let i in totals) {
              
              if (i != "Incoming" && i != "outgoing" && i != "Other" && i != "bulkTransactions") {
                totAv[i] = (totals.Incoming * 0.2 - totals[i]).toFixed(2)
                b[i] = document.getElementById(l[i]);   
                console.log("b[i]",b[i]);     
                x[i] = (totAv[i]>0?totAv[i]/totals2[i]*100:0).toFixed(2);
                b[i].textContent = "₳ " + parseFloat(totAv[i]>0?totAv[i]:0).toFixed(2);   
                document.getElementById(`${l[i]}`).style.width = x[i]+"%"
            console.log("totals",totals[i]);
              }
            }   
          }
          getWallet();
})
.catch(error => console.error(error))
};

