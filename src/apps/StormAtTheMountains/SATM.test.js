import { mount } from 'vue-test-utils'
import SATM from '@/apps/StormAtTheMountains/SATM.vue'

let cmp;

beforeEach(() => {
  cmp = mount(SATM, {
    methods: { mockFunction: () => { return true; } },
    data: function() {
      return {
        mockData: 'hello world'
      }
    }
  });
});

describe('Test tests', () => {
  it('Mock Function', () => {
    expect(cmp.vm.mockFunction()).toBeTruthy();
  });

  it('Mock Data', () => {
    expect(cmp.vm.mockData).toBe('hello world');
  });
});

describe('Base data', () => {
  it('Player Character', () => {
    expect(cmp.vm.playerCharacter).toEqual({
      name: '',
      class: 'Fighter',
      gender: 'Male',
      exp: 0,
      level: 1,
      hp: 100,
      hpMax: 100,
      mp: 50,
      minAttack: 30,
      maxAttack: 50
    });
  });

  it('Partner Character', () => {
    expect(cmp.vm.partner).toEqual({
      name: '',
      class: '',
      gender: '',
      exp: 0,
      level: 1,
      hp: 100,
      hpMax: 100,
      mp: 50,
      minAttack: 30,
      maxAttack: 50
    });
  });

  it('Stage', () => {
    expect(cmp.vm.stage).toBe(1);
  });

  it('Classes', () => {
    expect(cmp.vm.classes).toEqual([
              {name:'Fighter', description:'Likes to punch things, pretty tanky.'},
              {name:'Mage', description:'Likes to cast spells, pretty squishy.'}
             ]);
  });

  it('Genders', () => {
    expect(cmp.vm.genders).toEqual(['Male', 'Female', 'Other']);
  });

  it('Options 1', () => {
    expect(cmp.vm.options1).toEqual(['Chase him (Tutorial)', 'Let him go (Skip tutorial)']);
  });

  it('Decision 1', () => {
    expect(cmp.vm.decision1).toEqual(1);
  });

  it('Options 2', () => {
    expect(cmp.vm.options2).toEqual(['Give him some money', 'Let him go', 'Kill him']);
  });

  it('Decision 2', () => {
    expect(cmp.vm.decision2).toEqual(1);
  });

  it('Currently In Battle', () => {
    expect(cmp.vm.currentlyInBattle).toBeFalsy();
  });

  it('Enemies', () => {
    expect(cmp.vm.enemies).toEqual([]);
  });
});

describe('Generate Partner', () => {
  it('Generate Partner', () => {
    cmp.vm.generatePartner();
    console.log('Partner: '+cmp.vm.partner.name+' '+cmp.vm.partner.gender+' '+cmp.vm.partner.class);
    expect(cmp.vm.partner.name).not.toBe('');
    expect(cmp.vm.partner.class).not.toBe('');
    expect(cmp.vm.partner.gender).not.toBe('');
  });
});

describe('Classes', () => {
  it('getClassByName', () => {
    expect(cmp.vm.getClassByName(cmp.vm.classes[0].name)).toEqual(cmp.vm.classes[0]);
    expect(cmp.vm.getClassByName(cmp.vm.classes[1].name)).toEqual(cmp.vm.classes[1]);
  });
});

describe('Advance Stage', () => {
  it('Advance Stage 1 => 1 Without Name', () => {
    cmp.vm.playerCharacter.gender = 'A Gender';
    expect(cmp.vm.advanceStage(1)).toBe(1);
  });

  it('Advance Stage 1 => 1 Without Gender', () => {
    cmp.vm.playerCharacter.name = 'A Name';
    cmp.vm.playerCharacter.gender = '';
    expect(cmp.vm.advanceStage(1)).toBe(1);
  });

  it('Advance Stage 1 => 1 Without Name nor Gender', () => {
    expect(cmp.vm.advanceStage(1)).toBe(1);
  });

  it('Advance Stage 1 => 2 With Name', () => {
    cmp.vm.playerCharacter.name = 'A Name';
    cmp.vm.playerCharacter.gender = 'A Gender';
    expect(cmp.vm.advanceStage(1)).toBe(2);
  });

  it('Advance Stage 2 => 2 Without Class', () => {
    cmp.vm.playerCharacter.class = '';
    expect(cmp.vm.advanceStage(2)).toBe(2);
  });

  it('Advance Stage 2 => 3 With Class', () => {
    cmp.vm.playerCharacter.class = 'A Class';
    expect(cmp.vm.advanceStage(2)).toBe(3);
  });

  it('Advance Stage 3 => 4', () => {
    expect(cmp.vm.advanceStage(3)).toBe(4);
  });

  it('Advance Stage 4 => 4 Without decision', () => {
    cmp.vm.decision1 = '';
    expect(cmp.vm.advanceStage(4)).toBe(4);
  });

  it('Advance Stage 4 => 5 Tutorial', () => {
    cmp.vm.decision1 = 1;
    expect(cmp.vm.advanceStage(4)).toBe(5);
  });

  it('Advance Stage 4 => 9 Skip Tutorial', () => {
    cmp.vm.decision1 = 2;
    expect(cmp.vm.advanceStage(4)).toBe(9);
  });

  it('Advance Stage 5 => 6', () => {
    expect(cmp.vm.advanceStage(5)).toBe(6);
    expect(cmp.vm.currentlyInBattle).toBeTruthy();
  });
});

describe('Start Battle', () => {
  it('Start Battle 1', () => {
    cmp.vm.startBattle(1);
    expect(cmp.vm.enemies).toEqual([{
                                      name: 'Young Boy',
                                      hp: 50,
                                      hpMax: 50,
                                      minAttack: 5,
                                      maxAttack: 10
                                    }]);
  });

  it('Start Battle 2', () => {
    cmp.vm.startBattle(2);
    // Mountain Path 01 encoutners:
    const mountainPath01Encounters = [
      [
        {
          name: 'Kobold Warrior',
          hp: 60,
          hpMax: 60,
          minAttack: 5,
          maxAttack: 10
        },
        {
          name: 'Kobold Archer',
          hp: 25,
          hpMax: 25,
          minAttack: 20,
          maxAttack: 40
        }
      ],
      [
        {
          name: 'Lesser Water Elemental',
          hp: 70,
          hpMax: 70,
          minAttack: 10,
          maxAttack: 30
        }
      ],
      [
        {
          name: 'Lesser Wind Elemental',
          hp: 60,
          hpMax: 60,
          minAttack: 15,
          maxAttack: 40
        }
      ]
    ];
    expect(mountainPath01Encounters).toContainEqual(cmp.vm.enemies);
  });

  it('Start Battle 3', () => {
    cmp.vm.startBattle(3);
    // Mountain Path 02 encoutners:
    const mountainPath02Encounters = [
      [
        {
          name: 'Tiny Stone Golem',
          hp: 90,
          hpMax: 90,
          minAttack: 10,
          maxAttack: 15
        },
        {
          name: 'Tiny Stone Golem',
          hp: 90,
          hpMax: 90,
          minAttack: 10,
          maxAttack: 15
        }
      ],
      [
        {
          name: 'Water Elemental',
          hp: 100,
          hpMax: 100,
          minAttack: 20,
          maxAttack: 50
        }
      ],
      [
        {
          name: 'Wind Elemental',
          hp: 80,
          hpMax: 80,
          minAttack: 20,
          maxAttack: 60
        }
      ]
    ];
    expect(mountainPath02Encounters).toContainEqual(cmp.vm.enemies);
  });

  it('Start Battle 4', () => {
    cmp.vm.startBattle(4);
    expect(cmp.vm.enemies).toEqual([{
                                      name: 'Electrified Stone Golem',
                                      hp: 220,
                                      hpMax: 220,
                                      minAttack: 20,
                                      maxAttack: 40
                                    },
                                    {
                                      name: 'Black Warlock',
                                      hp: 80,
                                      hpMax: 80,
                                      minAttack: 40,
                                      maxAttack: 80
                                    }
                                  ]);
  });
});

describe ('Turns', () => {
  it('endTurn() 1 time', () => {
    cmp.vm.endTurn();
    expect(cmp.vm.activeCharacterIndex).toBe(1);
  });

  it('endTurn() 2 times', () => {
    cmp.vm.endTurn();
    cmp.vm.endTurn();
    expect(cmp.vm.activeCharacterIndex).toBe(0);
  });

  it('endTurn() 3 times', () => {
    cmp.vm.endTurn();
    cmp.vm.endTurn();
    cmp.vm.endTurn();
    expect(cmp.vm.activeCharacterIndex).toBe(1);
  });
});

describe ('Computed Things', () => {
  it('yourParty', () => {
    expect(cmp.vm.yourParty).toEqual([cmp.vm.playerCharacter, cmp.vm.partner]);
  });

  it('activeCharacter 0', () => {
    cmp.vm.activeCharacterIndex = 0;
    expect(cmp.vm.activeCharacter).toEqual(cmp.vm.playerCharacter);
  });

  it('activeCharacter 1', () => {
    cmp.vm.activeCharacterIndex = 1;
    expect(cmp.vm.activeCharacter).toEqual(cmp.vm.partner);
  });

  it('aliveEnemies alive', () => {
    cmp.vm.startBattle(2);
    expect(cmp.vm.aliveEnemies).toEqual(cmp.vm.enemies);
  });

  it('aliveEnemies 1 dead', () => {
    cmp.vm.startBattle(2);
    cmp.vm.enemies[0].hp = 0;
    if (cmp.vm.enemies.length == 2) {
      expect(cmp.vm.aliveEnemies).toEqual([cmp.vm.enemies[1]]);
    }
    else {
      expect(cmp.vm.aliveEnemies).toEqual([]);
    }
  });
});

describe('Combat Actions', () => {
  it('Attack', () => {
    cmp.vm.startBattle(1);
    const oldHp = cmp.vm.enemies[0].hp;
    cmp.vm.attack(cmp.vm.playerCharacter, cmp.vm.enemies[0]);
    expect(cmp.vm.enemies[0].hp).toBeLessThan(oldHp);
  });

  it('battleAttack', () => {
    cmp.vm.startBattle(2);
    const oldEnemiesHp = cmp.vm.enemies.reduce(function(accumulatedHp, enemy) {
      return accumulatedHp + enemy.hp;
    }, 0);
    cmp.vm.battleAttack();
    const enemiesHp = cmp.vm.enemies.reduce(function(accumulatedHp, enemy) {
      return accumulatedHp + enemy.hp;
    }, 0);
    expect(enemiesHp).toBeLessThan(oldEnemiesHp);
  });

  it('battleWait', () => {
    cmp.vm.battleWait();
    expect(cmp.vm.activeCharacterIndex).toBe(1);
  });
});

/* 1.
Name: [____________]
Gender: [Male, Female, Other]
*/

/* 2.
Select your class:

Fighter
Specialices on physical combat.

Mage
Specialices on magical combat.
*/

/* 3.
You see an enormous rock falling from the sky and landing on the mountains area,
the impact makes the ground temble.<br>
A heavy thunderstorm starts there.<br>
Lord Steiner offers a reward for those who go, investigate, and come back with a report.<br>
Since you are an adventurer, you decided to take the quest.<br>
Your friend {{ partner.name }} knows a way to the center of the mountains,
you both gear up and start your journey immediately.
*/

/* 4.
While you are heading to the mountains, you see a young boy running with a bag on his hand,
behind him is an old woman trying to catch him, but she is too slow.<br>
<b>Old Woman:</b> Please stop him, he stole my bag!!<br>
What are you going to do?:
[Chase him (Tutorial), Let him go (Skip tutorial)]
*/

/* 5. (Tutorial)
You chase the young boy until he enters a cave beneath the ruins of an old castle.<br>
The cave has no way out, the young boy is cornered.<br>
He refuses to give the bag back, he wants to fight.
*/

/* 6. BATTLE - Young Boy (Tutorial)
*/

/* 7. (Tutorial)
You retrieve the old woman's bag,
<Young Boy>: Please don't kill me, I will never steal again, I promise,
my mom is dying, she is ill, she needs medicine, I wanted to buy it for her,
please forgive me.
the young boy is begging for mercy: [Give him some money, Let him go, Kill him]
*/

/* 8. (Tutorial)
You give the bag back to the old woman.
<Old Woman>: May the goddess Leda bless your kind souls.
*/

/* 9.
You reach the base of the mountains, there is a thunderstorm here,
The strong winds and the heavy rain make the journey harder,
The noise of the thunders startles you every time,
The cold breeze on your face makes your nose freeze,
The water of the rain is going down by path you are following,

/* 10. BATTLE - Random (Mountain Path) x3
*/

/* 11.
As you are getting closer to the center of the mountains,
You notice that most lightnings are striking in the center of the mountains
*/

/* 12. BATTLE - Random (Mountain Path 2) x2
*/

/* 13.
You reach the center of the mountains,
You see an enormous humanoid body made from stone, it is a Stone Golem,
It is standing there without moving,
It is getting struck by most of the storm lightnings,
It doesn't seem get affected by them.
Behind it you spot a man wearing a black robe, it is a Warlock,
He is constantly moving his hands in a recurring pattern,
He has a fixed gaze and doesn't seem to have noticed your presence,
He suddenly he stop moving his hands, he stares directly at you,
The stone golem starts to move towards you.

/* 14. BATTLE - Stone Golem and Warlock
*/

/* 15
The storm at the mountains has stopped.
*/
