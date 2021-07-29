const express = require('express');
const app = express();


app.use(express.json());
let transactions = []; // array to store the transactions
let payerstotalPoints = new Map(); // map to store total available points for each payer

app.post('/add',(req,res) => {

    let transaction = req.body;
    transactions.push(transaction);

    //storing total points of each payer in a map
    let payer = transaction["payer"];
    let points = transaction["points"];
    if (payerstotalPoints.has(payer))
    {
        
            payerstotalPoints.set(payer, payerstotalPoints.get(payer) + points);
        
    } else payerstotalPoints.set(payer, points);
    
    //sorting the transactions according to the timestamp
    transactions = transactions.sort((a,b) => 
        (Date.parse(a.timestamp) > Date.parse(b.timestamp)) ? 1 : -1);

    res.send(transactions);
});

app.post('/spend', (req, res) =>
{
    let targetPoints = req.body["points"];
    let sumofallPoints = 0;
    
    //checking if we have required amount of points
    payerstotalPoints.forEach(points => {
        sumofallPoints += points;
    });

    if (sumofallPoints < targetPoints) {
        res.send("Not enough points. Total points available to spend: " + sumofallPoints);
    }

    let spentPoints = 0;
    let payers = new Map();

    for (let transaction of transactions) {
        if (spentPoints === targetPoints) {
            break;
        }
        if (transaction["points"] === 0) {
            continue;
        }
        let payer = transaction["payer"];
        if (payerstotalPoints.get(payer) === 0) {
            continue;
        }

        let points = transaction["points"];
        if (payerstotalPoints.get(payer) - points >= 0) {
            if(spentPoints + points > targetPoints) {
                points = (targetPoints - spentPoints);
                spentPoints = targetPoints;
                transaction["points"] -= points;
            } else {
                transactions[transactions.indexOf(transaction)] = 
                    {"payer": payer, "points": 0, "timestamp": transaction["timestamp"]};
                
                spentPoints += points;
            }
            payers.set(payer, 
                payers.has(payer) ? 
                ((payers.get(payer) * -1) + points) * -1 
                : points * -1);
            payerstotalPoints.set(payer, payerstotalPoints.get(payer) - points);
        } else {
            continue;
        }
    }
    res.json(JSON.stringify(Object.fromEntries(payers.entries())));
});

app.get('/get',(req, res) =>
{
    res.json(JSON.stringify(Object.fromEntries(payerstotalPoints.entries())));

});

app.listen(3000, () => console.log("Listening to port : 3000"))