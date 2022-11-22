import React from "react";
import { API_KEY } from "./constants";
import { Configuration, OpenAIApi } from "openai";

const getResults = (payload, callback, engineName="text-davinci-002") => {
  const configuration = new Configuration({
      apiKey: API_KEY,
    });
  const openai = new OpenAIApi(configuration);

  openai
      .createCompletion({
        model: engineName,
        prompt:payload,
        max_tokens: 1024,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      })
      .then((res) => {
        console.log(res.data.choices[0].text);
        let strings = res.data.choices[0].text.split('\n');
        strings = strings.filter((str) => {
          return str.length > 10;
        })
        callback(strings);
      });
}

function FilterComponent() {
  const [text, setText] = React.useState('');
  const [results, setResult] = React.useState([]);
  const [engineName, setEngineName] = React.useState('text-davinci-002')

  const handleTextChange = (event) => {
    setText(event.target.value);
  }
  return (
    <>
      <div className="title">
        <h1 className="heading">
          <img
            src={
              "https://logosandtypes.com/wp-content/uploads/2022/07/openai.svg"
            }
            alt={"UponAI"}
            width={35}
            height={35}
          />
          <span style={{ color: "black !important" }}> OPEN AI </span>
        </h1>
      </div>
      <div className="body">
        <div>
          <input
            style={{ marginRight: "10px", width: "30%" }}
            type="text"
            name="textfield"
            id="textfield"
            placeholder="Type text for completion..."
            value={text}
            onChange={handleTextChange}
          />
          <select style={{ marginRight: "10px" }} id="graphicStyle" onChange={(e)=> setEngineName(e.target.value)} value={engineName}>
            <option value="text-davinci-002">Text Davinci</option>
            <option value="davinci-instruct-beta">Davinci instruct-beta</option>
            <option value="davinci">davinci</option>
            <option value="ada">ada</option>
            <option value="curie">curie</option>
          </select>
        </div>
        <br />
        <br />
        <button onClick={() => {
          getResults(text, setResult, engineName)
        }}>Submit</button>
        {
          results.length > 0 && (
        <>
        <h2>List of Suggestions</h2>
        <span>{
        results.map((str) => {
          return (
          <p>
            <span>{str}</span>
            <span>{'                     '}</span>
            <button onClick={() => navigator.clipboard.writeText(str)}>Copy</button>
          </p>);
        })}</span>
        </>
          )
        }
      </div>
    </>
  );
}
export default FilterComponent;
