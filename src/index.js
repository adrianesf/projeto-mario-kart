const players = [
    {NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0}, 
    {NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0},
    {NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0},
    {NOME: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0},
    {NOME: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0},
    {NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0}
]

async function getPlayer() {
  return Math.floor(Math.random() * players.length);
}

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
  }

  return result;
}

async function getRandomConfronto() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.50:
      result = "CASCO";
      break;    
    default:
      result = "BOMBA";
  }

  return result;
}

async function getBonus() {
  let random = Math.random();
  let result = 0;

  switch (true) {
    case random < 0.50:
      result = 1;
      break;    
    default:
      result = 0;
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁 Rodada ${round}`);

    // sortear bloco
    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    // rolar os dados
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    //teste de habilidade
    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
      totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

      await logRollResult(character1.NOME,"velocidade",diceResult1,character1.VELOCIDADE);
      await logRollResult(character2.NOME,"velocidade",diceResult2,character2.VELOCIDADE);
    }

    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
      totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

      await logRollResult(character1.NOME,"manobrabilidade",diceResult1,character1.MANOBRABILIDADE);
      await logRollResult(character2.NOME,"manobrabilidade",diceResult2,character2.MANOBRABILIDADE);
    }

    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.PODER;
      let powerResult2 = diceResult2 + character2.PODER;

      let typeConfronto = await getRandomConfronto();
      let valorConfronto = typeConfronto === "CASCO" ? 1 : 2;
      let bonus = await getBonus();

      console.log(`${character1.NOME} confrontou com ${character2.NOME} com ${typeConfronto} ! 🥊`);

      await logRollResult(character1.NOME,"poder",diceResult1,character1.PODER);
      await logRollResult(character2.NOME,"poder",diceResult2,character2.PODER);

      if (powerResult1 > powerResult2 && character2.PONTOS > 0) {
        console.log(`${character1.NOME} venceu o confronto de ${typeConfronto}! ${character2.NOME} perdeu ${valorConfronto} ponto 🐢`);
        character2.PONTOS = character2.PONTOS - valorConfronto < 0 ? 0 : character2.PONTOS - valorConfronto;        
        character1.PONTOS+= bonus
        if(bonus > 0){
          console.log(`${character1.NOME} ganhou 1 ponto de bonus ✅`);  
        } else{
          console.log(`${character1.NOME} não ganhou ponto de bonus ⭕`);  
        }
      }

      if (powerResult2 > powerResult1 && character1.PONTOS > 0) {
        console.log(`${character2.NOME} venceu o confronto de ${typeConfronto}! ${character1.NOME} perdeu ${valorConfronto} ponto 🐢`);
        character1.PONTOS = character1.PONTOS - valorConfronto < 0 ? 0 : character1.PONTOS - valorConfronto;
        character2.PONTOS+= bonus
        if(bonus > 0){
          console.log(`${character2.NOME} ganhou 1 ponto de bonus ✅`);  
        } else{
          console.log(`${character2.NOME} não ganhou ponto de bonus ⭕`);  
        }
      }

      console.log(powerResult2 === powerResult1? "Confronto empatado! Nenhum ponto foi perdido": "");
    }

    // verificando o vencedor
    if (totalTestSkill1 > totalTestSkill2) {
      console.log(`${character1.NOME} marcou um ponto!`);
      character1.PONTOS++;
    } else if (totalTestSkill2 > totalTestSkill1) {
      console.log(`${character2.NOME} marcou um ponto!`);
      character2.PONTOS++;
    }

    console.log("-----------------------------");
  }
}

async function declareWinner(character1, character2) {
  console.log("Resultado final:");
  console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
  console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

  if (character1.PONTOS > character2.PONTOS)
    console.log(`\n${character1.NOME} venceu a corrida! Parabéns! 🏆`);
  else if (character2.PONTOS > character1.PONTOS)
    console.log(`\n${character2.NOME} venceu a corrida! Parabéns! 🏆`);
  else console.log("A corrida terminou em empate");
}

(async function main() {
  let numPlayer1 = 0;
  let numPlayer2 = 0;  

  numPlayer1 = await getPlayer();
  do{
    numPlayer2 = await getPlayer(); 
  } 
  while (numPlayer2 === numPlayer1);  

  const player1 = players[numPlayer1]
  const player2 = players[numPlayer2]

  console.log(
    `🏁🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`
  );

  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);
})();