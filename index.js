const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

var fetch = require('node-fetch');
/*
 * Complete the 'getTotalGoals' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING team
 *  2. INTEGER year
 */
async function getTotalGoals(team, year) {

  let total_goals = 0,
    uri_team1 = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1=${team}&page=`,
    uri_team2 = `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team2=${team}&page=`;

  total_goals += await makeRequest('team1', uri_team1);
  total_goals += await makeRequest('team2', uri_team2);

  console.log(`Totals Goals by ${team[0]} in year ${team[1]} is ${total_goals}`);
}

async function makeRequest(team, uri) {
  let page_no = 1, total_pages = 1, total_goals;
  uri += page_no;
  let response = await fetch(uri).then(response => response.json());
  total_pages = response.total_pages;
  total_goals = countGoals(response.data, team);
  page_no++;

  while(page_no <= total_pages) {
    uri = uri.splice(0, -1) + page_no;
    console.log(uri);
    response = await fetch(uri).then(response => response.json());
    total_goals += countGoals(response.data, team);
    page_no++;
  }

  return total_goals;
}
function countGoals(data, team) {
  let total_goals = 0;

  data.forEach(obj => {
    total_goals += parseInt(obj[`${team}goals`]);
  });

  return total_goals;
}

async function main() {
  /*
   * Enter input as eg.
   * barcelona
   * 2012
   * Ctl + D (To end input)
  */
    const ws = fs.createWriteStream('./output');

    const team = readLine();
    const year = parseInt(readLine().trim(), 10);

    const result = await getTotalGoals(team, year);

    ws.write(result + '\n');

    ws.end();
}
