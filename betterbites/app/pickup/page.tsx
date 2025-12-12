"use client";
import { buttonVariants } from "@/components/ui/button";
import React from "react";
import {useState} from "react";



const charities: Record<
  string,
  {
    accepts: string[];
    rejects: string[];
  }
> = {
  "North Texas Food Bank": {
    accepts: ["Canned goods", "Dry rice", "Dry pasta"],
    rejects: ["Open packages", "Expired food", "Homemade items"],
  },
  "Crossroads Community Services": {
    accepts: ["Cereal", "Peanut butter", "Canned vegetables"],
    rejects: ["Glass containers", "Expired food"],
  },
  "Feeding America": {
    accepts: ["Canned fruit", "Soup", "Boxed meals"],
    rejects: ["Perishables", "Damaged cans"],
  },
};

export default function PickupPage(){
  const [charity,setCharity]=useState("");
  const [pickupDate,setPickupDate]=useState("");
  const [timeSlot,setTimeSlot]=useState("");
  const [pickupSpecialInstructions,setpickupSpecialInstructions]=useState("");
  const [popupVisible,setpopupVisible]=useState(false);
  //for the pickup history popup
  const [popupPickups, setpopupPickups]=useState(false);


  const resetform=()=>{
    setCharity("");
    setPickupDate("");
    setpickupSpecialInstructions("");
    setTimeSlot("");
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setpopupVisible(true);
  };

  //Implementing feedback on how pickup date should not be past date 
  //function to calculate today's date
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const todayMin = getTodayDate();

  //implementing feedback to resrict user from typing and making errors
  const noTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Escape",
      "Enter",

    ];
    if(!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  }

  return(
    <div style={{fontFamily:"Roboto, sans-serif"}}>
      <div
        style={{
          backgroundColor:"#faf7f2",
          minHeight:"100vh",
          paddingTop:"60px",
        }}
      >
        <h1
          style={{
            textAlign:"center",
            fontSize:"32px",
            fontWeight:"bold",
            marginBottom:"25px",
            color:"#000"
          }}
        >
          Schedule Donation Pickup
        </h1>

        <form
          onSubmit={onFormSubmit}
          style={{
            width:"420px",
            margin:"0 auto",
            background:"white",
            padding:"40px",
            borderRadius:"10px",
            boxShadow:"0px 2px 10px rgba(0,0,0,0.15)",
            color:"#000"
          }}
        >

          <label style={{fontWeight:600}}>Choose a Charity</label>
          <select
            value={charity}
            onChange={(e)=>setCharity(e.target.value)}
            required
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:20,
              border:"1px solid #ccc",
              borderRadius:"10px",
              fontSize:19
            }}
          >
            <option value="">-- Select one --</option>
            {Object.keys(charities).map((name)=>(
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {charity && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  backgroundColor: "#E7F7E7",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #A8D5A3",
                  marginBottom: "12px",
                  fontSize: 19,
                  lineHeight: 1.25,
                  color: "#000",
                }}
              >
                <strong style={{ display: "block", marginBottom: 6 }}>Accepted Items</strong>
                <ul style={{ marginLeft: 20 }}>
                  {charities[charity].accepts.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>


              <div
                style={{
                  backgroundColor: "#FBEAEA",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #E4A1A1",
                  fontSize: 19,
                  lineHeight: 1.25,
                  color: "#000",
                }}
              >
                <strong style={{ display: "block", marginBottom: 6 }}>Not Accepted</strong>
                <ul style={{ marginLeft: 20 }}>
                  {charities[charity].rejects.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}      


          <label style={{fontWeight:600}}>Pickup Date</label>
          
          <input
            type="date"
            value={pickupDate}
            //implementing feedback: won't let user type date, only pick to prevent errors
            onKeyDown={noTyping}
            onChange={(e) => setPickupDate(e.target.value)}
            //set this min to validate the date -- causes user to not be able to select previous date 
            min={todayMin}
            required
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:"20px",
              borderRadius:"10px",
              border:"1px solid #ccc",
              fontSize:19
            }}
          />
          {/* adding hint to notify user to pick present or future date*/}
        
            <p 
            style={{
                marginTop: "6px",
                marginBottom: "10px",
                color: "#6B008D",
                fontSize: "15px",
                textAlign: "right",
                maxWidth: "60%",
                marginLeft: "auto",
                paddingRight: "10px"

            }}
            >The selected date must be today or a future date.</p>
          
          
          <label style={{fontWeight:600}}>Time Slot</label>
          <select
            value={timeSlot}
            onChange={(e)=>setTimeSlot(e.target.value)}
            required
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:20,
              border:"1px solid #ccc",
              borderRadius:"10px",
              fontSize:19
            }}
          >
            <option value="">-- Select time slot --</option>
            <option value="9-11AM">9:00-11:00 AM</option>
            <option value="11AM-1PM">11:00-1:00 PM</option>
            <option value="1-3PM">1:00-3:00 PM</option>
            <option value="3-5PM">3:00-5:00 PM</option>
            <option value="5-7PM">5:00-7:00 PM</option>
          </select>

          <label style={{fontWeight:600}}>Notes</label>
          <textarea
            value={pickupSpecialInstructions}
            onChange={(e)=>setpickupSpecialInstructions(e.target.value)}
            placeholder="Delivery Notes?"
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:20,
              border:"2px solid #ccc",
              borderRadius:"10px",
              height:80,
              fontSize:19
            }}
          />

          <button
            type="submit"
            style={{
              width:"100%",
              padding:"10px",
              marginBottom:20,
              backgroundColor:"#FFAC1C",
              border:"none",
              borderRadius:"10px",
              fontSize:20,
              cursor:"pointer",
            }}
          >
            Confirm Pickup
          </button>
        </form>
        
        <div
          style={{
            width:"260px",
            margin:"0 auto",
            marginTop:"5px",
            padding:"0 40px",
          }}
        >
          <button
          onClick={() => setpopupPickups(true)}
          style={{
            width:"200px",
            height:"100px",
            padding:"10px",
            marginBottom:20,
            backgroundColor:"#6750A4",
            border:"none",
            borderRadius:"10px",
            fontSize:20,
            color:"#fff",
            cursor:"pointer",
          }}
        >
          See Scheduled Pickups History
        </button>
        </div>
        

        {popupVisible&&(
          <div
            onClick={()=>setpopupVisible(false)}
            style={{
              position:"fixed",
              top:0,
              left:0,
              width:"100vw",
              height:"100vh",
              background:"rgba(0,0,0,0.5)",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
            }}
          >
            <div
              onClick={(e)=>e.stopPropagation()}
              style={{
                background:"#FFFFFF",
                borderRadius:"20px",
                textAlign:"center",
                padding:"30px",
                width:"300px",
                color:"#000"
              }}
            >
              {/* Implementing feedback of showing user confrimation of their pickup scheduled at chosen date and time */}
              <h2>Your Pickup Is Scheduled!</h2>
              <h3> Pickup Date: {pickupDate}</h3>
              <h3> Time Slot: {timeSlot} </h3>
              
              {/* call the resetform() after closing popup message*/}
              <button
                onClick={()=> {
                  setpopupVisible(false); 
                  resetform();
                }
                }

                style={{
                  marginTop:20,
                  border:"none",
                  fontSize:20,
                  background:"#FFAC1C",
                  padding:"10px 20px",
                  borderRadius:"10px",
                  cursor:"pointer",
                  color:"#000"
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

    {popupPickups && (
      <div
        onClick={() => setpopupPickups(false)}
        style={{
          position:"fixed",
          top:0,
          left:0,
          width: "105vw",
          height: "100vh",
          background:'rgba(0,0,0,0.5)',
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
        }}
      >
        <div
        onClick={(e)=>e.stopPropagation()}
        style={{
          background:"#FFFFFF",
          borderRadius:"20px",
          textAlign:"center",
          padding:"30px",
          width:"300px",
          color:"#000"
        }}
        >
          <h2 style={{
            marginBottom:'30px'
           
          }}>History of Scheduled Pickups</h2>
          <p style={{
            fontSize:16, 
            textAlign:'left',
            padding:'0 10px',
            lineHeight: 1.5
            }}>
          1. Crossroads Community Services on January 23, 2026 from 9:00 - 11:00AM.
          <br></br>
          2. NorthTexasFood Bank on February 13, 2026 from 3:00 - 5:00 PM. Delivery Notes: No milk!
           </p>

        <button
          onClick={() => setpopupPickups(false)}
          style={{
            marginTop: 20,
            backgroundColor:'#FFAC1C',
            color:'black',
            cursor:'pointer',
          }}

        >
          Close History
        </button>
      </div>
    </div>
    )}
  </div>
</div>
  );
}

