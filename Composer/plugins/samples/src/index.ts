// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import fs from 'fs';

const samplesDir = path.resolve(__dirname, '../assets/samples');
const samplesRegitry = {
  '*': {  // base registry item, can be override by later specific entry
    index: 1000000, 
    tags: ["Basic"],
    support: ["*"]
  },
  EchoBot: {
    name: 'Echo Bot',
    description: 'A bot that echoes and responds with whatever message the user entered',
    index: 1,
  },
  EmptyBot: {
    name: 'Empty Bot',
    description: 'Basic bot template that is ready for your creativity',
    index: 2,
  },
  TodoSample: {
    name: 'Simple Todo',
    description: 'A sample bot that allows you to add, list, and remove to do items.',
    index: 3,
  },
  ToDoBotWithLuisSample: {
    name: 'Todo with LUIS',
    description: 'A sample bot that allows you to add, list, and remove to do items using Language Understanding',
    index: 4,
  },
  RespondingWithCardsSample: {
    name: 'Responding with Cards',
    description: 'A sample bot that uses Language Generation to create cards.',
  },
  AskingQuestionsSample: {
    name: 'Asking Questions',
    description: 'A sample bot that shows how to ask questions and capture user input.',
  },
  InterruptionSample: {
    name: 'Interruptions',
    description: 'An advanced sample bot that shows how to handle context switching and interruption in a conversation.',
  },
  RespondingWithTextSample: {
    name: 'Responding with Text',
    description: 'A sample bot that uses Language Generation to create bot responses.',
  },
  ControllingConversationFlowSample: {
    name: 'Controlling Conversation Flow',
    description: 'A sample bot that shows how to control the flow of a conversation.',
  },
  ActionsSample: {
    name: 'Dialog Actions',
    description: 'A sample bot that shows how to use Dialog Actions.',
  },
  QnAMakerLUISSample: {
    name: 'QnA Maker and LUIS',
    description: 'A sample bot that demonstrates use of both QnA Maker & LUIS',
  }
}



function getSamplePaths(dir: string) {
  const templateBase = {
  }
}

function getSamples(): any[] {
  const paths = fs.readdirSync(samplesDir);
  console.log(paths);
  const samples = [];
  for (const p in paths) {
    if (!fs.statSync(p).isDirectory()) {
      return;
    }

    // only looking for directories
    const dirname = path.basename(p);
    if (samplesRegitry[dirname]) {
      console.log(`Found sample ${dirname}`);
    } 
    else {
      console.log(`Folder added in ${p}, but not registered`);
    }

  }
}


export default async (composer: any): Promise<void> => {
  // register this publishing method with Composer
  for (const temlate in getSamples()) {
    //await composer.addBotTemplate(temlate);
  }
};