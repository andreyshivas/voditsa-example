export default function getCurrentLevel(bonuses) {
  let levelInfo = {
    level: 1,
    levelStart: 0,
    levelEnd: 80,
  };

  if (bonuses >= 0 && bonuses < 80) {
    levelInfo = {
      level: 1,
      levelStart: 0,
      levelEnd: 80,
    }
  }

  if (bonuses >= 80 && bonuses < 150) {
    levelInfo = {
      level: 2,
      levelStart: 80,
      levelEnd: 150,
    }
  }

  if (bonuses >= 150 && bonuses < 220) {
    levelInfo = {
      level: 3,
      levelStart: 150,
      levelEnd: 220,
    }
  }

  if (bonuses >= 220 && bonuses < 300) {
    levelInfo = {
      level: 4,
      levelStart: 220,
      levelEnd: 300,
    }
  }

  if (bonuses >= 300 && bonuses < 380) {
    levelInfo = {
      level: 5,
      levelStart: 300,
      levelEnd: 380,
    }
  }

  if (bonuses >= 380 && bonuses < 460) {
    levelInfo = {
      level: 6,
      levelStart: 380,
      levelEnd: 460,
    }
  }

  if (bonuses >= 460 && bonuses < 550) {
    levelInfo = {
      level: 7,
      levelStart: 460,
      levelEnd: 550,
    }
  }

  if (bonuses >= 550 && bonuses < 680) {
    levelInfo = {
      level: 8,
      levelStart: 550,
      levelEnd: 680,
    }
  }

  if (bonuses >= 680 && bonuses < 800) {
    levelInfo = {
      level: 9,
      levelStart: 680,
      levelEnd: 800,
    }
  }

  if (bonuses >= 800) {
    levelInfo = {
      level: 10,
      levelStart: 800,
      levelEnd: 0,
    }
  }

  return levelInfo;
}
