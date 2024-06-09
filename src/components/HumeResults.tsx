import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { TMessageOwner } from './Message.tsx';
import { PsychologicalStressReport } from '../structs/gpt.interface.ts';
import { AttrWithStressLevel } from './AttrWithStressLevel.tsx';
import { getChatGPTAnalysis } from '../api/gpt.ts';

export const HumeResults: React.FC = () => {
  const { humeChat } = useAppContext();
  const [analysis, setAnalysis] = useState<PsychologicalStressReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getChatGPTAnalysis(humeChat);
        setAnalysis(result);
        console.log('analysis', result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred');
        }
      }

      setLoading(false);
    };

    fetchAnalysis();
  }, [humeChat]);

  return (
    <div className="results-container">
      <div>
        { loading && <div>Loading...</div> }
        { analysis && (
          <div>
            <h1>Analysis</h1>
            <br/>
            <div>Classification</div>
            <div>{ analysis.classification }</div>
            <br/>
            <div>Conclusion</div>
            <div>{ analysis.conclusion }</div>
            <br/>
            <div>Summary</div>
            <div>{ analysis.summary }</div>
            <br/>
            <AttrWithStressLevel attrName="Psychologically Fine" stressLevels={ analysis.psychologicallyFine }/>
            <br/>
            <AttrWithStressLevel attrName="Positive But Cautious" stressLevels={ analysis.positiveButCautious }/>
            <br/>
            <AttrWithStressLevel attrName="Neutral" stressLevels={ analysis.neutral }/>
            <br/>
            <AttrWithStressLevel attrName="Mildly Stressed" stressLevels={ analysis.mildlyStressed }/>
            <br/>
            <AttrWithStressLevel attrName="Moderately Stressed" stressLevels={ analysis.moderatelyStressed }/>
            <br/>
            <AttrWithStressLevel attrName="Highly Stressed" stressLevels={ analysis.highlyStressed }/>
            <br/>
          </div>
        ) }
        { error && <div>Error: { error }</div> }
      </div>
      <h1>Dialogue</h1>
      <div className={ `flex flex-col` }>
        { humeChat.map((message, index) => (
          <div key={index} className={ `flex flex-row gap-3` }>
            <div>{ message.message.role === TMessageOwner.User ? 'User' : 'Agent' }</div>
            <div>{ message.message.content }</div>
          </div>
        )) }
      </div>
      <pre>{ JSON.stringify(humeChat, null, 2) }</pre>
    </div>
  );
}
