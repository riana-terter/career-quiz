let cur = 0, score = 0, streak = 0;
let answered = new Array(CAREERS.length).fill(null);
let optSets = [];

function shuffle(a) {
  let b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function buildOpts(idx) {
  const right = CAREERS[idx];
  const others = shuffle(CAREERS.filter((_, i) => i !== idx)).slice(0, 3);
  return shuffle([right, ...others]);
}

function render() {
  const c = CAREERS[cur];
  const isAnswered = answered[cur] !== null;

  // Image section
  const imgSec = document.getElementById('imgSection');
  if (isAnswered) {
    imgSec.classList.add('visible');
    document.getElementById('imgBg').style.backgroundImage = `url('${c.img}')`;
    document.getElementById('careerImg').src = c.img;
    document.getElementById('imgInfoName').textContent = c.name;
    document.getElementById('imgInfoDesc').textContent = c.desc;
    document.getElementById('imgInfoStudies').textContent = c.studies;
    document.getElementById('imgInfoSkills').textContent = c.skills.join(' · ');
    document.getElementById('imgInfoDid').textContent = c.did_you_know;
  } else {
    imgSec.classList.remove('visible');
  }

  // Stats
  document.getElementById('cardCounter').textContent = (cur + 1) + ' / ' + CAREERS.length;
  document.getElementById('cardVal').textContent = (cur + 1) + '/12';
  document.getElementById('scoreVal').textContent = score;
  document.getElementById('streakVal').textContent = streak;

  const done = answered.filter(a => a !== null).length;
  document.getElementById('progFill').style.width = Math.round(done / CAREERS.length * 100) + '%';

  // Clues
  document.getElementById('cluesList').innerHTML = c.clues.map(t => `
    <div class="clue-item">
      <div class="clue-dot"></div>
      <div class="clue-text">${t}</div>
    </div>`).join('');

  // Answer slot
  document.getElementById('showBtnWrap').style.display = isAnswered ? 'none' : 'block';
  const ab = document.getElementById('answerBox');
  if (isAnswered) {
    ab.style.display = 'block';
    const correct = answered[cur] === c.id;
    ab.className = 'answer-box ' + (correct ? 'correct-box' : 'wrong-box');
    document.getElementById('ansName').textContent = c.name;
    document.getElementById('ansDesc').textContent = c.desc;
  } else {
    ab.style.display = 'none';
    ab.className = 'answer-box';
  }

  // Options
  if (!optSets[cur]) optSets[cur] = buildOpts(cur);
  document.getElementById('optGrid').innerHTML = optSets[cur].map(o => {
    let cls = 'opt';
    if (isAnswered) {
      if (o.id === c.id) cls += ' correct';
      else if (o.id === answered[cur]) cls += ' wrong';
    }
    return `<button class="${cls}" ${isAnswered ? 'disabled' : ''} onclick="guess('${o.id}')">${o.name}</button>`;
  }).join('');

  // Dots
  document.getElementById('dots').innerHTML = CAREERS.map((_, i) =>
    `<div class="dot ${i === cur ? 'active' : answered[i] !== null ? 'done' : ''}"></div>`
  ).join('');

  document.getElementById('prevBtn').disabled = cur === 0;
  document.getElementById('nextBtn').disabled = cur === CAREERS.length - 1;
}

function guess(id) {
  if (answered[cur] !== null) return;
  answered[cur] = id;
  const correct = id === CAREERS[cur].id;
  if (correct) { score++; streak++; } else { streak = 0; }
  render();
  if (answered.every(a => a !== null)) setTimeout(finish, 1000);
}

function revealAnswer() {
  answered[cur] = '__revealed__';
  render();
  if (answered.every(a => a !== null)) setTimeout(finish, 1000);
}

function go(d) {
  cur = Math.max(0, Math.min(CAREERS.length - 1, cur + d));
  render();
}

function finish() {
  document.getElementById('gameMain').style.display = 'none';
  const fs = document.getElementById('finishScreen');
  fs.style.display = 'flex';
  const pct = Math.round(score / CAREERS.length * 100);
  document.getElementById('fScore').textContent = score + '/12';
  document.getElementById('fPct').textContent = pct + '%';
  document.getElementById('finishTitle').textContent = pct >= 80 ? 'Career expert!' : pct >= 50 ? 'Great explorer!' : 'Keep discovering!';
  document.getElementById('finishMsg').textContent = pct >= 80 ? 'Impressive, you really know your careers!' : pct >= 50 ? 'Good job! There is so much more to explore.' : 'Every career is a new world, keep going!';
  document.getElementById('finishIcon').textContent = pct >= 80 ? '🏆' : pct >= 50 ? '🌟' : '🚀';
}

function restart() {
  cur = 0; score = 0; streak = 0;
  answered = new Array(CAREERS.length).fill(null);
  optSets = [];
  document.getElementById('finishScreen').style.display = 'none';
  document.getElementById('gameMain').style.display = 'block';
  CAREERS.sort(() => Math.random() - 0.5);
  render();
}

// Shuffle career order at the start of each game
CAREERS.sort(() => Math.random() - 0.5);
render();
