import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('');
  const [verse, setVerse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false)
  const [prevprompt, setPrevPrompt] = useState('')

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  }

  const callGenerateEndpoint = async() =>{
    setIsGenerating(true);

    console.log("Calling OpenAI ...")
    const response = await fetch('/api/generate',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userInput: userInput}),
    });

    const data = await response.json();
    // console.log(data)
    const { output } = data;
    console.log("OpenAI replied", output.text)

    setApiOutput(`${output.text}`);
    setVerse(data.verse)
    setPrevPrompt(userInput)
    setIsGenerating(false);
  }
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Biblical Bot | Fab</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>A Biblical Bot</h1>
          </div>
          <div className="header-subtitle">
            <h2>A bot that will give you biblical answers</h2>
          </div>
          <div className="prompt-container">
          <textarea placeholder="start typing here" className="prompt-box" 
          value={userInput}
          onChange={onUserChangedText}/>
        </div>
        </div>
        <div className="prompt-container">
        <div className='prompt-buttons'>
          <a className={isGenerating? 'generate-button loading': 'generate-button'}
           onClick={callGenerateEndpoint}>
            <div className='generate'>
              {isGenerating ? <span className='loader'></span>:<p>Generate</p>}
            </div>
          </a>
        </div>
        </div>
        {apiOutput && (
          <div className='output'>
            <div className='output-header-container'>
              <div className='output-header'>
                <h3>Output</h3>
              </div>
            </div>
            <div className='output-content'>
              <p>{"Input: " + prevprompt + '\n'} {verse+ '\n'} {apiOutput}</p>
            </div>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
