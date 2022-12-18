const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { verifySignature } = require("./services")


app.use(cors());
app.use(express.json());

const balances = {
  "5f037e0f886cc6033cd840b21525dc3aa0f521de": 100,
  "cebaf24c5ff4154765666b583dde5de6ca44933e": 50,
  "beb2e1d5fc1656f0da184a12279f07b40e23ffc2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const msg = JSON.stringify({
    recipient,
    amount
  })
  let isValid = verifySignature(signature, msg, sender);
  if (isValid === false){
    res.status(400).send({ message: "Invalid Signature!" })
    return
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
