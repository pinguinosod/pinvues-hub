<template>
  <div>
    <h3>Storm at the Mountains</h3>
    <div v-if="stage == 1">
      Your name: <input type="text" v-model="playerCharacter.name">
      Your gender: <select v-model="playerCharacter.gender"><option :value="gender" v-for="gender in genders">{{gender}}</option></select>
    </div>

    <div v-else-if="stage == 2">
      Your class: <select v-model="playerCharacter.class"><option :value="aclass" v-for="aclass in classes">{{aclass}}</option></select>
    </div>

    <div v-else-if="stage == 3">
      You see an enormous rock falling from the sky and landing on the mountains area,
      the impact makes the ground temble.<br>
      A heavy thunderstorm starts there.<br>
      Lord Steiner offers a reward for those who go, investigate, and come back with a report.<br>
      Since you are an adventurer, you decided to take the quest.<br>
      Your friend {{ partner.name }} knows a way to the center of the mountains,
      you both gear up and start your journey immediately.
    </div>

    <div v-else-if="stage == 4">
      While you are heading to the mountains, you see a young boy running with a bag on his hand,
      behind him is an old woman trying to catch him, but she is too slow.<br>
      <b>Old Woman:</b> Please stop him, he stole my bag!!<br>
      What are you going to do?:
      <select v-model="decision1"><option :value="(index+1)" v-for="(decision, index) in options1">{{decision}}</option></select>
    </div>

    <div v-else-if="stage == 5">
      You chase the young boy until he enters a cave beneath the ruins of an old castle.<br>
      The cave has no way out, the young boy is cornered.<br>
      He refuses to give the bag back, he wants to fight.
    </div>

    <div v-else-if="stage == 6">
    </div>

    <div v-else-if="stage == 7">
    </div>

    <div v-else-if="stage == 8">
    </div>

    <div v-else-if="stage == 9">
    </div>

    <div v-else-if="stage == 10">
    </div>

    <div v-else-if="stage == 11">
    </div>

    <div v-else-if="stage == 12">
    </div>

    <div v-else-if="stage == 13">
    </div>

    <div v-else-if="stage == 14">
    </div>

    <div v-else-if="stage == 15">
    </div>

    <hr>
    <button class="btn btn-primary" @click="stage = advanceStage(stage)">Ok</button>
  </div>
</template>

<script>

export default {
  data: function() {
    return {
      test: 'hello world',
      playerCharacter: {
        name: '',
        class: '',
        gender: '',
        exp: 0,
        level: 1,
        hp: 100,
        mp: 50,
        minAttack: 30,
        maxAttack: 50
      },
      partner: {
        name: '',
        class: '',
        gender: '',
        exp: 0,
        level: 1,
        hp: 100,
        mp: 50,
        minAttack: 30,
        maxAttack: 50
      },
      stage: 1,
      classes: ['Fighter', 'Mage'],
      genders: ['Male', 'Female', 'Other'],
      names: [
        ['Markus', 'Stefan', 'Hartwig', 'Maximilian'],
        ['Sabine', 'Johanna', 'Jacqueline', 'Christina']
      ],
      options1: ['Chase him (Tutorial)', 'Let him go (Skip tutorial)'],
      decision1: 1,
      options2: ['Give him some money', 'Let him go', 'Kill him'],
      decision2: 1,
      currentlyInBattle: false,
      enemies: []
    }
  },
  methods: {
    generatePartner: function() {
      const rndClass = Math.floor(Math.random() * this.classes.length);
      this.partner.class = this.classes[rndClass];

      const rndGender = Math.floor(Math.random() * this.genders.length);
      this.partner.gender = this.genders[rndGender];

      const rndNameGender = rndGender > 1 ? Math.floor(Math.random() * 2) : rndGender;
      const rndName = Math.floor(Math.random() * this.names[rndNameGender].length);
      this.partner.name = this.names[rndNameGender][rndName];
    },
    advanceStage: function(currentStage) {
      switch(currentStage) {
        case 1:
          if (this.playerCharacter.name != ''
              && this.playerCharacter.gender != '') return 2;
        break;

        case 2:
          if (this.playerCharacter.class != '') {
            this.generatePartner();
            return 3;
          }
        break;

        case 3:
          return 4;
        break;

        case 4:
          if (this.decision1 == 1) return 5; // tutorial
          else if (this.decision1 == 2) return 9; // skip tutorial
        break;

        case 5:
          this.currentlyInBattle = this.startBattle(1);
          return 6;
        break;

        case 6:
          if (!this.currentlyInBattle) return 7;
        break;

        case 7:
        break;

        case 8:
        break;

        case 9:
        break;

        case 10:
        break;

        case 11:
        break;

        case 12:
        break;

        case 13:
        break;

        case 14:
        break;

        case 15:
        break;
      }
      return currentStage; // a validation failed, stay on the current stage
    },
    startBattle: function(battleN) {
      let battleStarted = false;

      switch(battleN) {
        case 1: // Young Boy (Tutorial)
          this.enemies = [{
                            name: 'Young Boy',
                            hp: 50,
                            minAttack: 5,
                            maxAttack: 10
                          }];
          battleStarted = true;
        break;

        case 2: // Random (Mountain Path)
          const mountainPath01Encounters = [
            [
              {
                name: 'Kobold Warrior',
                hp: 60,
                minAttack: 5,
                maxAttack: 10
              },
              {
                name: 'Kobold Archer',
                hp: 25,
                minAttack: 20,
                maxAttack: 40
              }
            ],
            [
              {
                name: 'Goblin',
                hp: 70,
                minAttack: 10,
                maxAttack: 20
              }
            ]
          ];

          const rndEnemy = Math.floor(Math.random() * mountainPath01Encounters.length);
          this.enemies = mountainPath01Encounters[rndEnemy];
          battleStarted = true;
        break;

        case 3: // Random (Mountain Path 2)
          const mountainPath02Encounters = [
            [
              {
                name: 'Tiny Stone Golem',
                hp: 90,
                minAttack: 10,
                maxAttack: 15
              },
              {
                name: 'Tiny Stone Golem',
                hp: 90,
                minAttack: 10,
                maxAttack: 15
              }
            ],
            [
              {
                name: 'Water Elemental',
                hp: 100,
                minAttack: 20,
                maxAttack: 50
              }
            ],
            [
              {
                name: 'Wind Elemental',
                hp: 80,
                minAttack: 20,
                maxAttack: 60
              }
            ]
          ];

          const rndEnemy2 = Math.floor(Math.random() * mountainPath02Encounters.length);
          this.enemies = mountainPath02Encounters[rndEnemy2];
          battleStarted = true;
        break;

        case 4: // Stone Golem and Warlock
          this.enemies = [
            {
              name: 'Electrified Stone Golem',
              hp: 220,
              minAttack: 20,
              maxAttack: 40
            },
            {
              name: 'Black Warlock',
              hp: 80,
              minAttack: 40,
              maxAttack: 80
            }
          ];
          battleStarted = true;
        break;
      }

      return battleStarted;
    }
  },
  mounted: function() {
    this.playerCharacter.gender = this.genders[0];
    this.playerCharacter.class = this.classes[0];
  }
}

</script>
