import React, {useEffect, useState, useCallback} from "react";
import "./App.css";
import ReactMapGL, {Marker, NavigationControl, Popup, GeolocateControl, FullscreenControl, FlyToInterpolator} from "react-map-gl";
import Navigation from "./components/navigation";

//format [[name, description, lat, long], [...], ...]
const hotelData = require("./data/all_hotel_polarity.json"); 

//control variable for navigation control
const geolocateStyle = {
  top: "7%",
  right: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: "12%",
  right: 0,
  padding: '10px'
};

const navStyle = {
  top: "17%",
  right: 0,
  padding: '10px'
};



function Map() {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100vh',
    latitude: 13.7458435,
    longitude: 100.5174359,
    zoom: 12,
    pitch:30
  });
  
  const[selectHotel, setSelectHotel] = useState(null);


  //useEffect for closing pop-up when esc is pressed 
useEffect(()=>{
  const listener = event => {
    if (event.key === "Escape") {
      setSelectHotel(null);
    }
  };
  window.addEventListener("keydown", listener);
  return () => {
    window.removeEventListener("keydown", listener);
  };
}, []);


const onSelectCity = useCallback(({longitude, latitude}) => {
  setViewport({
    longitude,
    latitude,
    zoom: 12,
    transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
    transitionDuration: 'auto'
  });
}, []);

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapboxApiAccessToken = "pk.eyJ1IjoibmlkdXAxMDEwIiwiYSI6ImNsMXcwbno3czM3NjEzYnM5NDJqZmI0eTYifQ.ZhXkbHXZx8b6MZP6-dvIyg"
      mapStyle = "mapbox://styles/mapbox/streets-v11">

      <Navigation
       onSelectCity = {onSelectCity}
      />
      
      <NavigationControl style={navStyle} />
      <FullscreenControl style={fullscreenControlStyle} />

      <GeolocateControl style={geolocateStyle} />


      {hotelData.map((hotel, index) =>(
        <Marker 
          key ={index}
          latitude = {parseFloat(hotel[4])}
          longitude = {parseFloat(hotel[5])}
        >
            <img
              src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
              alt="Marker"
              className="marker_icon"
              onClick={e =>{e.preventDefault();
                setSelectHotel(hotel);}}
              />
         
        </Marker>      
      ))}
      {selectHotel ? (
        <Popup latitude={parseFloat(selectHotel[4])} longitude={parseFloat(selectHotel[5])}
        onClose = {() => {
          setSelectHotel(null)
        }}
        
        > 
          <div className="pop_up"> 
            <div className="image_title"> 
              <h3>{selectHotel[0]}</h3>
              {/* <img className = "hotel_image" src={selectHotel[6]} alt="BigCo Inc. logo"/> */}
            </div>
              <hr></hr>
              <p>{selectHotel[3]}</p>
          </div>

        </Popup> 
      ) : null}
    </ReactMapGL>
  );
}

export default Map;
