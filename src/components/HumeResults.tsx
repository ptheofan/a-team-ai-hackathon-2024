import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { TMessageOwner } from './Message.tsx';
import { PsychologicalStressReport, TruthfulnessReport } from '../structs/gpt.interface.ts';
import { AttrWithStressLevel } from './AttrWithStressLevel.tsx';
import { getChatGPTAnalysis } from '../api/gpt.ts';
import { stressPrompt, truthPrompt } from '../consts.ts';

export const HumeResults: React.FC = () => {
  const { humeChat } = useAppContext();
  const [stressAnalysis, setStressAnalysis] = useState<PsychologicalStressReport | null>(null);
  const [truthAnalysis, setTruthAnalysis] = useState<TruthfulnessReport | null>(null);
  const [loadingStress, setLoadingStress] = useState(false);
  const [loadingTruth, setLoadingTruth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // truth
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingTruth(true);
      setError(null);

      try {
        const result = await getChatGPTAnalysis(truthPrompt, humeChat);
        const analysis = JSON.parse(result) as TruthfulnessReport;
        setTruthAnalysis(analysis);
        console.log('truthAnalysis', result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred');
        }
      }

      setLoadingTruth(false);
    };

    fetchAnalysis();
  }, [humeChat]);

  // stress
  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingStress(true);
      setError(null);

      try {
        const result = await getChatGPTAnalysis(stressPrompt, humeChat);
        const analysis = JSON.parse(result) as PsychologicalStressReport;
        setStressAnalysis(analysis);
        console.log('stressAnalysis', result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred');
        }
      }

      setLoadingStress(false);
    };

    fetchAnalysis();
  }, [humeChat]);

  return (
    <div className="results-container">
      <div>
        { (loadingStress || loadingTruth) && <div>Loading...</div> }
        { truthAnalysis && (
          <div>
            <h1>Stress Analysis</h1>
            <br/>
            <div>likelihood</div>
            <div>{ truthAnalysis.likelihood }</div>
            <br/>
            <AttrWithStressLevel attrName="veryLikelyNotLying" stressLevels={ truthAnalysis.veryLikelyNotLying }/>
            <br/>
            <AttrWithStressLevel attrName="possiblyNotLying" stressLevels={ truthAnalysis.possiblyNotLying }/>
            <br/>
            <AttrWithStressLevel attrName="neutralUnclear" stressLevels={ truthAnalysis.neutralUnclear }/>
            <br/>
            <AttrWithStressLevel attrName="possiblyLying" stressLevels={ truthAnalysis.possiblyLying }/>
            <br/>
            <AttrWithStressLevel attrName="veryLikelyLying" stressLevels={ truthAnalysis.veryLikelyLying }/>
          </div>
        ) }
        <br/>
        { stressAnalysis && (
          <div>
            <h1>Stress Analysis</h1>
            <br/>
            <div>Classification</div>
            <div>{ stressAnalysis.classification }</div>
            <br/>
            <div>Conclusion</div>
            <div>{ stressAnalysis.conclusion }</div>
            <br/>
            <div>Summary</div>
            <div>{ stressAnalysis.summary }</div>
            <br/>
            <AttrWithStressLevel attrName="Psychologically Fine" stressLevels={ stressAnalysis.psychologicallyFine }/>
            <br/>
            <AttrWithStressLevel attrName="Positive But Cautious" stressLevels={ stressAnalysis.positiveButCautious }/>
            <br/>
            <AttrWithStressLevel attrName="Neutral" stressLevels={ stressAnalysis.neutral }/>
            <br/>
            <AttrWithStressLevel attrName="Mildly Stressed" stressLevels={ stressAnalysis.mildlyStressed }/>
            <br/>
            <AttrWithStressLevel attrName="Moderately Stressed" stressLevels={ stressAnalysis.moderatelyStressed }/>
            <br/>
            <AttrWithStressLevel attrName="Highly Stressed" stressLevels={ stressAnalysis.highlyStressed }/>
            <br/>
          </div>
        ) }
        { error && <div>Error: { error }</div> }
      </div>
      <h1>Dialogue</h1>
      <div className={ `flex flex-col` }>
        { humeChat.map((message, index) => (
          <div key={ index } className={ `flex flex-row gap-3` }>
            <div>{ message.message.role === TMessageOwner.User ? 'User' : 'Agent' }</div>
            <div>{ message.message.content }</div>
          </div>
        )) }
      </div>
      <pre>{ JSON.stringify(humeChat, null, 2) }</pre>
    </div>
  );
};
