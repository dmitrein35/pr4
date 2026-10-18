const $btnKick = document.getElementById('btn-kick');
const $btnSpecial = document.getElementById('btn-special');
const $logs = document.getElementById('logs');

const logs = [
  '[ПЕРСОНАЖ №1] вспомнил что-то важное, но неожиданно [ПЕРСОНАЖ №2], не помня себя от испуга, ударил в предплечье врага.',
  '[ПЕРСОНАЖ №1] поперхнулся, и за это [ПЕРСОНАЖ №2] с испугу приложил прямой удар коленом в лоб врага.',
  '[ПЕРСОНАЖ №1] забылся, но в это время наглый [ПЕРСОНАЖ №2], приняв волевое решение, неслышно подойдя сзади, ударил.',
  '[ПЕРСОНАЖ №1] пришел в себя, но неожиданно [ПЕРСОНАЖ №2] случайно нанес мощнейший удар.',
  '[ПЕРСОНАЖ №1] поперхнулся, но в это время [ПЕРСОНАЖ №2] нехотя раздробил кулаком <вырезанно цензурой> противника.',
  '[ПЕРСОНАЖ №1] удивился, а [ПЕРСОНАЖ №2] пошатнувшись влепил подлый удар.',
  '[ПЕРСОНАЖ №1] высморкался, но неожиданно [ПЕРСОНАЖ №2] провел дробящий удар.',
  '[ПЕРСОНАЖ №1] пошатнулся, и внезапно наглый [ПЕРСОНАЖ №2] беспричинно ударил в ногу противника',
  '[ПЕРСОНАЖ №1] расстроился, как вдруг, неожиданно [ПЕРСОНАЖ №2] случайно влепил стопой в живот соперника.',
  '[ПЕРСОНАЖ №1] пытался что-то сказать, но вдруг, неожиданно [ПЕРСОНАЖ №2] со скуки, разбил бровь сопернику.'
];

const character = {
  name: 'Pikachu',
  defaultHP: 100,
  damageHP: 100,
  elHP: document.getElementById('health-character'),
  elProgressbar: document.getElementById('progressbar-character'),
  renderHP,
  renderHPLife,
  renderProgressbarHP,
  changeHP,
};

const enemy = {
  name: 'Charmander',
  defaultHP: 100,
  damageHP: 100,
  elHP: document.getElementById('health-enemy'),
  elProgressbar: document.getElementById('progressbar-enemy'),
  renderHP,
  renderHPLife,
  renderProgressbarHP,
  changeHP,
};

function createCountClick(limit, $btn) {
  let count = 0;

  return function (maxCharDamage, maxEnemyDamage) {
    if (count >= limit) {
      console.log(`Кнопку "${$btn.innerText}" більше не можна натискати! Ліміт вичерпано.`);
      $btn.disabled = true;
      return;
    }

    count += 1;
    const rest = limit - count;

    console.log(`Кнопку "${$btn.innerText}" натиснуто ${count} раз(ів). Залишилось натискань: ${rest}`);

    makeAttack(maxCharDamage, maxEnemyDamage);

    if (rest === 0) {
      console.log(`Спроби для кнопки "${$btn.innerText}" закінчилися!`);
      $btn.disabled = true;
    }
  };
}

const btnKickClick = createCountClick(6, $btnKick);
const btnSpecialClick = createCountClick(6, $btnSpecial);

$btnKick.addEventListener('click', function () {
  btnKickClick(20, 20);
});

$btnSpecial.addEventListener('click', function () {
  btnSpecialClick(15, 35);
});

function makeAttack(maxCharDamage, maxEnemyDamage) {
  const charDamage = random(maxCharDamage);
  const enemyDamage = random(maxEnemyDamage);

  character.changeHP(charDamage, enemy);
  enemy.changeHP(enemyDamage, character);
}

function disableButtons() {
  $btnKick.disabled = true;
  $btnSpecial.disabled = true;
}

function random(num) {
  return Math.ceil(Math.random() * num);
}

function init() {
  character.renderHP();
  enemy.renderHP();
}

function renderHP() {
  this.renderHPLife();
  this.renderProgressbarHP();
}

function renderHPLife() {
  const { elHP, damageHP, defaultHP } = this;
  elHP.innerText = `${damageHP} / ${defaultHP}`;
}

function renderProgressbarHP() {
  const { elProgressbar, damageHP, defaultHP } = this;
  const percentage = (damageHP / defaultHP) * 100;
  
  elProgressbar.style.width = `${percentage}%`;
  elProgressbar.classList.remove('low', 'critical');

  if (percentage < 20) {
    elProgressbar.classList.add('critical');
  } else if (percentage < 60) {
    elProgressbar.classList.add('low');
  }
}

function changeHP(count, target) {
  if (this.damageHP < count) {
    this.damageHP = 0;
    alert(`Бедный ${this.name} проиграл бой!`);
    disableButtons();
  } else {
    this.damageHP -= count;
  }

  this.renderHP();
  generateLog(this, target, count);
}

function generateLog(firstPerson, secondPerson, count) {
  const { name: defenderName, damageHP, defaultHP } = firstPerson;
  const { name: attackerName } = secondPerson;

  const logText = logs[random(logs.length) - 1]
    .replace('[ПЕРСОНАЖ №1]', defenderName)
    .replace('[ПЕРСОНАЖ №2]', attackerName);

  const $p = document.createElement('p');$p.innerText = `${logText} [-${count}] [${damageHP}/${defaultHP}]`;

  $logs.insertBefore($p,$logs.children[0]);
}

init();