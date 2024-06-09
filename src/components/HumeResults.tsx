import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import { TMessageOwner } from './Message.tsx';
import { getChatGPTAnalysis } from '../api/gpt.ts';
import { AnalysisResponse } from '../structs/gpt.interface.ts';

export const HumeResults: React.FC = () => {
  const { humeChat } = useAppContext();
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        const chatGPTAnalysis = await getChatGPTAnalysis(humeChat);
        setAnalysis(chatGPTAnalysis);
        console.log('analysis', chatGPTAnalysis);
      } catch (err) {
        setError(err.message);
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
            <h1 className={ `text-xl` }>Analysis</h1>
            <div className={ `text-sm` }>Conclusion</div>
            <div className={ `text-xs` }>{ analysis.conclusion }</div>
            <div className={ `text-sm` }>Summary</div>
            <div className={ `text-xs` }>{ analysis.analysis }</div>
            <div className={ `text-xl` }>Highlights</div>
            { analysis.highlights.map((highlight, index) => (
              <div key={index}>
                <div>{ highlight.title }</div>
                <div>{ JSON.stringify(highlight.attributes, null, 2) }</div>
              </div>
            )) }
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
