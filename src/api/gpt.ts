import { HumeMessage } from '../structs/chat.interface.ts';
import { TMessageOwner } from '../components/Message.tsx';
import { AnalysisResponse } from '../structs/gpt.interface.ts';

export const getChatGPTAnalysis = async (humeChat: HumeMessage[]): Promise<AnalysisResponse> => {
  const prompt = import.meta.env.VITE_OPENAI_GPT_PROMPT.replace(/\\n/g, "\n");
  //
  // humeChat =
  //   [
  //     {
  //       'role': 0,
  //       'message': {
  //         'content': 'Hi. Oh my god.',
  //         'role': 0
  //       },
  //       'models': {
  //         'scores': {
  //           'admiration': 0.018659310415387154,
  //           'adoration': 0.060934439301490784,
  //           'aestheticAppreciation': 0.015768807381391525,
  //           'amusement': 0.2594396471977234,
  //           'anger': 0.03627430275082588,
  //           'anxiety': 0.08238570392131805,
  //           'awe': 0.19909341633319855,
  //           'awkwardness': 0.04194994270801544,
  //           'boredom': 0.0030656871385872364,
  //           'calmness': 0.0009313742630183697,
  //           'concentration': 0.0006087356596253812,
  //           'confusion': 0.05335620418190956,
  //           'contemplation': 0.0008565448806621134,
  //           'contempt': 0.010533098131418228,
  //           'contentment': 0.002495791297405958,
  //           'craving': 0.0029215235263109207,
  //           'desire': 0.04603343456983566,
  //           'determination': 0.005507768131792545,
  //           'disappointment': 0.10055817663669586,
  //           'disgust': 0.14065566658973694,
  //           'distress': 0.240992933511734,
  //           'doubt': 0.007405445910990238,
  //           'ecstasy': 0.04885241389274597,
  //           'embarrassment': 0.1077258363366127,
  //           'empathicPain': 0.03982510790228844,
  //           'entrancement': 0.015835504978895187,
  //           'envy': 0.006136197596788406,
  //           'excitement': 0.14172647893428802,
  //           'fear': 0.08256994187831879,
  //           'guilt': 0.016284160315990448,
  //           'horror': 0.205977201461792,
  //           'interest': 0.03094073198735714,
  //           'joy': 0.060707032680511475,
  //           'love': 0.014074809849262238,
  //           'nostalgia': 0.004840966779738665,
  //           'pain': 0.03596322983503342,
  //           'pride': 0.002395238261669874,
  //           'realization': 0.1847885400056839,
  //           'relief': 0.03488792106509209,
  //           'romance': 0.006065034307539463,
  //           'sadness': 0.014426660723984241,
  //           'satisfaction': 0.00907120667397976,
  //           'shame': 0.021815087646245956,
  //           'surpriseNegative': 0.6225632429122925,
  //           'surprisePositive': 0.6342191100120544,
  //           'sympathy': 0.012496799230575562,
  //           'tiredness': 0.004468508530408144,
  //           'triumph': 0.007180307060480118
  //         }
  //       }
  //     },
  //     {
  //       'role': 1,
  //       'message': {
  //         'content': 'Hello there!',
  //         'role': 1
  //       },
  //       'models': {
  //         'scores': {
  //           'admiration': 0.09197998046875,
  //           'adoration': 0.102294921875,
  //           'aestheticAppreciation': 0.03753662109375,
  //           'amusement': 0.234619140625,
  //           'anger': 0.041259765625,
  //           'anxiety': 0.00356292724609375,
  //           'awe': 0.06817626953125,
  //           'awkwardness': 0.1221923828125,
  //           'boredom': 0.050384521484375,
  //           'calmness': 0.035675048828125,
  //           'concentration': 0.0107269287109375,
  //           'confusion': 0.0516357421875,
  //           'contemplation': -0.01348114013671875,
  //           'contempt': 0.018951416015625,
  //           'contentment': 0.0943603515625,
  //           'craving': 0.0018358230590820312,
  //           'desire': 0.0011568069458007812,
  //           'determination': 0.0174102783203125,
  //           'disappointment': 0.018524169921875,
  //           'disgust': 0.03448486328125,
  //           'distress': 0.04364013671875,
  //           'doubt': 0.034881591796875,
  //           'ecstasy': 0.042816162109375,
  //           'embarrassment': 0.020751953125,
  //           'empathicPain': -0.02349853515625,
  //           'entrancement': 0.01293182373046875,
  //           'envy': 0.0323486328125,
  //           'excitement': 0.27880859375,
  //           'fear': 0.0205535888671875,
  //           'guilt': -0.0030727386474609375,
  //           'horror': 0.01314544677734375,
  //           'interest': 0.28466796875,
  //           'joy': 0.22705078125,
  //           'love': 0.05877685546875,
  //           'nostalgia': 0.018280029296875,
  //           'pain': -0.004833221435546875,
  //           'pride': 0.03521728515625,
  //           'realization': 0.014129638671875,
  //           'relief': 0.05364990234375,
  //           'romance': 0.0037937164306640625,
  //           'sadness': -0.002986907958984375,
  //           'satisfaction': 0.07501220703125,
  //           'shame': 0.0035343170166015625,
  //           'surpriseNegative': 0.038116455078125,
  //           'surprisePositive': 0.269775390625,
  //           'sympathy': -0.01387786865234375,
  //           'tiredness': 0.00885009765625,
  //           'triumph': 0.018951416015625
  //         }
  //       }
  //     },
  //     {
  //       'role': 1,
  //       'message': {
  //         'content': 'My name is Amani.',
  //         'role': 1
  //       },
  //       'models': {
  //         'scores': {
  //           'admiration': 0.088134765625,
  //           'adoration': 0.0745849609375,
  //           'aestheticAppreciation': -0.00322723388671875,
  //           'amusement': 0.1256103515625,
  //           'anger': 0.045623779296875,
  //           'anxiety': 0.0178985595703125,
  //           'awe': 0.040496826171875,
  //           'awkwardness': 0.0792236328125,
  //           'boredom': 0.024871826171875,
  //           'calmness': 0.057891845703125,
  //           'concentration': 0.08062744140625,
  //           'confusion': 0.0479736328125,
  //           'contemplation': 0.02447509765625,
  //           'contempt': 0.03314208984375,
  //           'contentment': 0.08868408203125,
  //           'craving': 0.0313720703125,
  //           'desire': 0.0106201171875,
  //           'determination': 0.1497802734375,
  //           'disappointment': -0.0005764961242675781,
  //           'disgust': 0.001987457275390625,
  //           'distress': 0.0294189453125,
  //           'doubt': 0.042236328125,
  //           'ecstasy': 0.061553955078125,
  //           'embarrassment': 0.021270751953125,
  //           'empathicPain': -0.013519287109375,
  //           'entrancement': 0.0186309814453125,
  //           'envy': 0.0256805419921875,
  //           'excitement': 0.276611328125,
  //           'fear': 0.0364990234375,
  //           'guilt': 0.0159759521484375,
  //           'horror': 0.03753662109375,
  //           'interest': 0.2216796875,
  //           'joy': 0.138671875,
  //           'love': 0.06243896484375,
  //           'nostalgia': 0.006130218505859375,
  //           'pain': -0.01477813720703125,
  //           'pride': 0.12066650390625,
  //           'realization': 0.06829833984375,
  //           'relief': 0.048614501953125,
  //           'romance': 0.016387939453125,
  //           'sadness': 0.00464630126953125,
  //           'satisfaction': 0.08868408203125,
  //           'shame': 0.01837158203125,
  //           'surpriseNegative': -0.0158233642578125,
  //           'surprisePositive': 0.1488037109375,
  //           'sympathy': -0.043731689453125,
  //           'tiredness': -0.006473541259765625,
  //           'triumph': 0.057373046875
  //         }
  //       }
  //     },
  //     {
  //       'role': 1,
  //       'message': {
  //         'content': 'What is your name?',
  //         'role': 1
  //       },
  //       'models': {
  //         'scores': {
  //           'admiration': 0.0308685302734375,
  //           'adoration': 0.03460693359375,
  //           'aestheticAppreciation': -0.0355224609375,
  //           'amusement': 0.1182861328125,
  //           'anger': 0.135498046875,
  //           'anxiety': 0.059600830078125,
  //           'awe': 0.0305328369140625,
  //           'awkwardness': 0.0740966796875,
  //           'boredom': 0.037384033203125,
  //           'calmness': 0.0477294921875,
  //           'concentration': 0.05963134765625,
  //           'confusion': 0.387939453125,
  //           'contemplation': 0.0203094482421875,
  //           'contempt': 0.0655517578125,
  //           'contentment': 0.05047607421875,
  //           'craving': 0.0008859634399414062,
  //           'desire': -0.01446533203125,
  //           'determination': 0.0662841796875,
  //           'disappointment': 0.03179931640625,
  //           'disgust': 0.0257720947265625,
  //           'distress': 0.0631103515625,
  //           'doubt': 0.10333251953125,
  //           'ecstasy': 0.03326416015625,
  //           'embarrassment': 0.023040771484375,
  //           'empathicPain': 0.00325775146484375,
  //           'entrancement': 0.004894256591796875,
  //           'envy': 0.034423828125,
  //           'excitement': 0.06396484375,
  //           'fear': 0.031585693359375,
  //           'guilt': 0.004352569580078125,
  //           'horror': 0.01433563232421875,
  //           'interest': 0.283203125,
  //           'joy': 0.0045623779296875,
  //           'love': 0.0027751922607421875,
  //           'nostalgia': 0.0179901123046875,
  //           'pain': 0.01479339599609375,
  //           'pride': 0.0299835205078125,
  //           'realization': 0.06512451171875,
  //           'relief': 0.00969696044921875,
  //           'romance': 0.0155792236328125,
  //           'sadness': -0.0003199577331542969,
  //           'satisfaction': 0.0144500732421875,
  //           'shame': 0.0179290771484375,
  //           'surpriseNegative': 0.128662109375,
  //           'surprisePositive': 0.1341552734375,
  //           'sympathy': -0.0184326171875,
  //           'tiredness': 0.0157623291015625,
  //           'triumph': 0.0254364013671875
  //         }
  //       }
  //     }
  //   ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ import.meta.env.VITE_OPENAI_API_KEY }`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL_ID,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        ...humeChat.map((message) => {
          let content;
          if (message.message.role === TMessageOwner.User) {
            content = JSON.stringify({
              message: message.message.content,
              scores: message.models?.scores,
            });
          } else {
            content = message.message.content;
          }

          return {
            role: message.message.role === TMessageOwner.User ? 'user' : 'assistant',
            content: content
          };
        }),
      ],
      top_p: 1,
      max_tokens: 4095,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from OpenAI');
  }

  const data = await response.json();
  console.log(data.choices[0].message.content.replace("\n", ''));
  return JSON.parse(data.choices[0].message.content.replace("\n", '')) as AnalysisResponse;
}
