import React, { useEffect } from 'react';
import { MS_KNOWLEDGE_API_SECONDARY_KEY } from '../keys';

function AcademicKnowledge() {
  useEffect(() => {
    const params: { [key: string]: string } = {
      model: 'latest',
      count: '10',
      offset: '0',
      attributes: 'Ti,Y,CC,AA.AuN,AA.AuId'
    };

    var queryString = Object.keys(params)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      })
      .join('&');

    fetch(
      `https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate?expr=Composite(AA.AuN=='suraj jacob')&${queryString}`,
      {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': MS_KNOWLEDGE_API_SECONDARY_KEY
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  }, []);

  return <div></div>;
}

export default AcademicKnowledge;
