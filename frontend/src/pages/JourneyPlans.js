import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../JourneyPlans.css'; // Assuming you have a CSS file for styling
import { FaCheck, FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';

const JourneyPlans = () => {
    const[journey_plans,setJourneyPlans]=useState([]);
    const[journey_plan_name,setJourneyPlanName]=useState('');
    const[journey_plan_locations,setJourneyPlanLocation]=useState('');
    const[start_date,setStartDate]=useState('');
    const[end_date,setEndDate]=useState('');
    const[list_of_activites,setListOfActivities]=useState('');
    const[description,setDescription]=useState('');

    const formatDate=(dateString)=>{
        if(!dateString) return '';
        return dateString.split('T')[0]; //format date to YYYY-MM-DD
    }

    //fetch all journey plans
    const fetchJourneyPlans = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/journeyPlans');
            console.log('Response:',response.data); //log the response for debugging
            setJourneyPlans(response.data);
        } catch (error) {
            console.error('erorr fetching journey plans:',error.response || error);
        }

    };

    //add a new journey plan
    const addJourneyPlan = async () => {
        await axios.post('http://localhost:5000/api/journeyPlans', {
            journey_plan_name,
            journey_plan_locations,
            start_date,
            end_date,
            list_of_activites,
            description,
        });
        fetchJourneyPlans(); //refresh the list
    };

    //Update a journey plan
    const updateJourneyPlan = async (id) => {
        await axios.put(`http://localhost:5000/api/journeyPlans/${id}`, {
            journey_plan_name,
            journey_plan_locations,
            start_date,
            end_date,
            list_of_activites,
            description,
        });
        fetchJourneyPlans(); //refresh the list
    };
    

    //delete a journey plan
    const deleteJourneyPlan = async(id)=>{
        await axios.delete(`http://localhost:5000/api/journeyPlans/${id}`);
        fetchJourneyPlans(); //refresh the list
    };

    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end-today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return diffDays;
    };
    
    useEffect(()=> {
        fetchJourneyPlans();
    },[]);

    return (
        
        <div className="journey-plans-container">
            <h1 className='title'>Journey Plans</h1>
            <p className='journey-plan-desc'>Upcoming adventures and travel dreams</p>
            
            
            {/* Form for adding new journey plans */}
            <div className='journey-plan-form'>
                <input
                    type="text"
                    placeholder="Journey Plan Name"
                    value={journey_plan_name}
                    onChange={(e) => setJourneyPlanName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Journey Plan Location"
                    value={journey_plan_locations}
                    onChange={(e) => setJourneyPlanLocation(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={end_date}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="List Of Activities"
                    value={list_of_activites}
                    onChange={(e) => setListOfActivities(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={addJourneyPlan}>Add Journey Plan</button>
            </div>
            
                      {/* Display journey plans in cards */}
                      <div className="journey-plans-grid">
                {journey_plans.map((journey_plan) => (
                    <div key={journey_plan.id} className="journey-plan-card">
                        <div className="card-header">
                            <h2>{journey_plan.journey_plan_name}</h2>
                            <div className="checkbox-container">
                                {journey_plan.completed ? (
                                    <FaRegCheckCircle className="checkbox-icon checked" />
                                ) : (
                                    <FaRegCircle className="checkbox-icon" />
                                )}
                                <span>{journey_plan.journey_plan_locations}</span>
                            </div>
                            <div className="date-range">
                                {formatDate(journey_plan.start_date)} - {formatDate(journey_plan.end_date)}
                            </div>
                        </div>
                        
                        <div className="card-body">
                            <p>{journey_plan.description}</p>
                        </div>
                        
                        <div className="card-footer">
                            <div className="days-left">
                                {calculateDaysLeft(journey_plan.end_date) > 0 ? (
                                    <span>{calculateDaysLeft(journey_plan.end_date)} days left</span>
                                ) : (
                                    <span>Trip completed!</span>
                                )}
                            </div>
                            <div className="card-actions">
                                <button className='update-button' onClick={() => updateJourneyPlan(journey_plan.id)}>
                                    Update
                                </button>
                                <button className='delete-button' onClick={() => deleteJourneyPlan(journey_plan.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default JourneyPlans;