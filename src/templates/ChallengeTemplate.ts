/**
 * Implementation of the original video as a Challenge Template
 * Based on: https://www.youtube.com/shorts/NjlP2_l1Wr0
 */

import { ChallengeTemplate } from '../types/template';

export const OriginalChallengeTemplate: ChallengeTemplate = {
  id: 'find-key-escape-room',
  name: 'Find the Key Challenge',
  description: 'A competitive challenge where players must find hidden keys while avoiding consequences from the game master',

  metadata: {
    originalVideo: 'https://www.youtube.com/shorts/NjlP2_l1Wr0',
    duration: 35,
    difficulty: 'easy',
    minParticipants: 3, // 1 gamemaster + 2 players minimum
    maxParticipants: 8  // 1 gamemaster + 7 players maximum
  },

  challenge: {
    objective: 'Find the key',
    targetObjects: ['keys'],
    rules: [
      'Players must find all hidden keys',
      'Game master monitors with eyes covered',
      'Game master can shoot players with paintball gun',
      'All players except one must succeed'
    ],
    successCondition: 'Find and secure a key',
    failureConsequence: 'Extra paintball shots as punishment',
    isCustomizable: true
  },

  participants: [
    {
      id: 'gamemaster',
      role: 'gamemaster',
      name: 'Game Master',
      equipment: ['paintball gun', 'eyemask'],
      isCustomizable: true
    },
    {
      id: 'player1',
      role: 'player',
      name: 'Player 1',
      isCustomizable: true
    },
    {
      id: 'player2', 
      role: 'player',
      name: 'Player 2',
      isCustomizable: true
    },
    {
      id: 'player3',
      role: 'player', 
      name: 'Player 3',
      isCustomizable: true
    },
    {
      id: 'player4',
      role: 'player',
      name: 'Danny',
      isCustomizable: true
    }
  ],

  environment: {
    location: 'enclosed room',
    props: ['3 hidden keys', 'paintball gun', 'eyemask', 'various hiding spots'],
    constraints: ['enclosed space', 'limited hiding spots'],
    isCustomizable: true
  },

  segments: {
    intro: {
      startTime: 0,
      duration: 3,
      content: {
        dialogue: [
          {
            speaker: 'gamemaster',
            text: 'Find the key. Escape the room. Good luck, boys!',
            timing: 0,
            isCustomizable: true
          }
        ],
        actions: [
          {
            type: 'interaction',
            description: 'Game master explains the challenge',
            participants: ['gamemaster'],
            timing: 0,
            isCustomizable: true
          }
        ],
        visualElements: [
          {
            type: 'environment',
            description: 'Show room setup and hidden key locations',
            timing: 0,
            isCustomizable: true
          }
        ]
      }
    },

    gameplay: {
      startTime: 3,
      duration: 27,
      content: {
        dialogue: [
          {
            speaker: 'gamemaster',
            text: "There's three keys. This is easy.",
            timing: 1,
            isCustomizable: true
          },
          {
            speaker: 'player',
            text: "Let's gooo!",
            timing: 3,
            isCustomizable: true
          },
          {
            speaker: 'gamemaster',
            text: "Where are you?",
            timing: 8,
            isCustomizable: true
          },
          {
            speaker: 'player',
            text: "Behind you!",
            timing: 12,
            isCustomizable: true
          },
          {
            speaker: 'player',
            text: "Got one, I got it, I got it!",
            timing: 15,
            isCustomizable: true
          },
          {
            speaker: 'player',
            text: "Where is the key?",
            timing: 18,
            isCustomizable: true
          },
          {
            speaker: 'gamemaster',
            text: "Two keys left",
            timing: 20,
            isCustomizable: true
          }
        ],
        actions: [
          {
            type: 'movement',
            description: 'Players search room frantically',
            participants: ['player1', 'player2', 'player3', 'player4'],
            timing: 0,
            isCustomizable: true
          },
          {
            type: 'interaction',
            description: 'Game master shoots paintball gun while blindfolded',
            participants: ['gamemaster'],
            timing: 2,
            isCustomizable: true
          },
          {
            type: 'interaction',
            description: 'Players find keys one by one',
            participants: ['player1', 'player2', 'player3'],
            timing: 15,
            isCustomizable: true
          }
        ],
        visualElements: [
          {
            type: 'effect',
            description: 'Chaotic searching and dodging',
            timing: 0,
            isCustomizable: true
          },
          {
            type: 'prop',
            description: 'Keys being discovered',
            timing: 15,
            isCustomizable: true
          }
        ]
      }
    },

    conclusion: {
      startTime: 30,
      duration: 5,
      content: {
        dialogue: [
          {
            speaker: 'gamemaster',
            text: "Everyone has a key but Danny, this is his punishment, boom boom, subscribe!",
            timing: 0,
            isCustomizable: true
          }
        ],
        actions: [
          {
            type: 'consequence',
            description: 'Extra paintball shots for the losing player',
            participants: ['gamemaster', 'player4'],
            timing: 1,
            isCustomizable: true
          }
        ],
        visualElements: [
          {
            type: 'effect',
            description: 'Call to action overlay',
            timing: 3,
            isCustomizable: true
          }
        ]
      }
    }
  },

  customizationOptions: {
    allowParticipantChange: true,
    allowChallengeChange: true,
    allowEnvironmentChange: true,
    allowDialogueChange: true
  }
}; 