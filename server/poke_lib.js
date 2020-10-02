const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({
  extended: true
}))

var cardsData = {};

app.get('/:pokemon', function (req, res) {
    if (req.params.pokemon in cardsData){
        res.send(cardsData[req.params.pokemon]);
    }else{
        let pokeApi_link = "https://pokeapi.co/api/v2/pokemon/" + req.params.pokemon;
        axios.get(pokeApi_link).then(response => {
            cardsData[req.params.pokemon] = response.data;
            res.send(response.data);
        })
        .catch(() => {
            res.send({"error": "Pokemon not found"});     
          })
    }
})

app.post('/', function (req, res) {
    cardsData[req.query.ID] = {type: req.query.card_type, value: req.query.card_value};
    res.send("Card stored");
})

app.get('/', function (req, res) {
    console.log(req.query.ID);
    if (req.query.ID == "all"){
        res.send(cardsData);
    }else {
        res.send(cardsData[req.query.ID]);
    }
})

app.put('/', function (req, res) {
    if (req.body.ID in cardsData){
        cardsData[req.body.ID].value = req.body.value;
        res.send(cardsData[req.body.ID]);
    }else{
        res.send("Not in cards");
    }    
})

app.delete('/', function (req, res) {
    if (req.query.ID in cardsData){
        delete cardsData[req.query.ID];
        res.send(cardsData);
    }else{
        res.send("Not in cards");
    }    
})

app.listen(3000)