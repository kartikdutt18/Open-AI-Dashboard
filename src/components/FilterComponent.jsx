import React, { useState } from "react";
import {gettyApiKey, gettyApiSecret, keywordForImagesWithText} from './constants';
const api = require("@vineetshekhawat/gettyimages-api");

function FilterComponent() {

    const [data, setData]  = useState([]);
    const [searchTerm,setSearchTerm] = useState("");
    const [style,setStyle] = useState("");
    const [textCheckBox, setTextCheckBox] = useState(false);
    const [mediaCount, setMediaCount] = useState(5);
    const [videoCheckBox, setVideoCheckBox] = useState(false);

    function avoidTextCheckBoxStatus() {
        // Get the checkbox
        var checkBox = document.getElementById("textCheckBox");
        // If the checkbox is checked, update state
        if (checkBox.checked === true){
            setTextCheckBox(true);
        } else {
            setTextCheckBox(false);
        }
    }

    function videoResultsCheckBoxStatus() {
        // Get the checkbox
        var checkBox = document.getElementById("videoCheckBox");
        // If the checkbox is checked, update state
        if (checkBox.checked === true){
            setData([]);
            document.getElementById('graphicStyle').disabled = true;
            document.getElementById('textCheckBox').disabled = true;
            setVideoCheckBox(true);
        } else {
            setData([]);
            document.getElementById('graphicStyle').disabled = false;
            document.getElementById('textCheckBox').disabled = false;
            setVideoCheckBox(false);
        }
    }

    async function FetchGettyImages() {
        var creds = { apiKey: gettyApiKey, apiSecret: gettyApiSecret };
        var client = new api(creds);
        document.getElementById("SearchButton").disabled = true;
        document.getElementById("videoCheckBox").disabled = true;

        if(searchTerm === "")
        {
            setData([]);
            console.log("empty string- nothing available");
            document.getElementById("SearchButton").disabled = false;
            return;
        }

        if(videoCheckBox)
        {
            var searchVideosQuery = client.searchvideos().withPage(1).withPageSize(mediaCount); // add count of images
            searchVideosQuery.withPhrase(searchTerm); // add search term
            const searchResponse = await searchVideosQuery.execute(); //fetch response
            setData(searchResponse.videos);
            console.log("response video", searchResponse.videos);
            console.log("no videos available");
            document.getElementById("SearchButton").disabled = false;
            document.getElementById("videoCheckBox").disabled = false;
            return;
        }

        var searchQuery = client.searchimages().withPage(1).withPageSize(mediaCount); // add count of images
        if(textCheckBox) searchQuery.withExcludeKeywordId(keywordForImagesWithText); // exclude images with text
        if(style !== "" && style !== "all") searchQuery.withGraphicalStyle(style); // add graphic style if any
        searchQuery.withPhrase(searchTerm); // add search term
        const searchResponse = await searchQuery.execute(); //fetch response
        setData(searchResponse.images);
        document.getElementById("SearchButton").disabled = false;
        document.getElementById("videoCheckBox").disabled = false;
        console.log("response images", searchResponse.images);
    }

    return <>
        <div className="title">
            <h1 className="heading">Search Getty Images</h1>
        </div>
        <div className="body">
            <div>
                <input style= {{marginRight: '10px'}} type="text" name="textfield" id="textfield" placeholder="Search media for text..." onChange={(e)=> setSearchTerm(e.target.value)} />
                <select style= {{marginRight: '10px'}} id="graphicStyle" onChange={(e)=> setStyle(e.target.value)}>
                    <option value="all">all styles</option>
                    <option value="photography">photography</option>
                    <option value="illustration">illustration</option>
                    <option value="vector">vector</option>
                </select>
                <input style= {{marginRight: '10px', width: '25px'}} type="text" name="textfield" id="textfield" placeholder="5" onChange={(e)=> setMediaCount(e.target.value)} />
                <input style= {{marginRight: '10px'}} name="" type="button" id= "SearchButton" value="Search" onClick={()=> FetchGettyImages()}></input>
                <input type="checkbox" id="textCheckBox" onClick={()=>avoidTextCheckBoxStatus()}/>
                <label style= {{marginRight: '20px'}} id="textCheckBox"> Without text</label>
                <input type="checkbox" id="videoCheckBox" onClick={()=>videoResultsCheckBoxStatus()}/>
                <label id="videoCheckBox"> Videos </label>
            </div>
            <h2>List of Media</h2>
            <span>From Getty API</span>
            <ul className="items-unorder">
                {data
                    // .filter((data) => data.title.toLowerCase().includes(input))
                    .map((items)=> {
                    return (
                        <>  
                            <li className="items-list" key={items.id}>
                                <div className="card">
                                    <div className="card-content">
                                        <h3>{items.id}</h3>
                                        {
                                            videoCheckBox
                                            ?   <video width="175px" height= "175px" controls="controls" transform= "translate(-50%)">
                                                    <source src= {items.display_sizes[0].uri} type="video/mp4"/>
                                                </video>
                                            :   <img src={ items.display_sizes[0].uri } alt={'hi'} width="175px" height="175px"></img>
                                        }
                                        <span className="sub-title">
                                            <a  target="_blank" rel="noopener noreferrer" href={items.display_sizes[0].uri}>MediaLink</a>
                                        </span>
                                    </div>
                                    <div className="edge-right"></div>
                                </div>
                            </li>  
                        </>
                    );
                })}
            </ul> 
        </div>
    </>;
}
export default FilterComponent;