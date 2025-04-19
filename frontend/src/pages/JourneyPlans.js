import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../JourneyPlans.css'; // Assuming you have a CSS file for styling
import { FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';

const JourneyPlans = () => {
    const[journey_plans,setJourneyPlans]=useState([]);
    const[journey_plan_name,setJourneyPlanName]=useState('');
    const[journey_plan_locations,setJourneyPlanLocation]=useState('');
    const[start_date,setStartDate]=useState('');
    const[end_date,setEndDate]=useState('');
    const[list_of_activities,setListOfActivities]=useState('');
    const[description,setDescription]=useState('');

    const formatDate=(dateString)=>{
        if(!dateString) return '';
        return dateString.split('T')[0]; //format date to YYYY-MM-DD
    }

    //fetch all journey plans
    const fetchJourneyPlans = async() => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/journeyPlans', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setJourneyPlans(response.data);
        } catch (error) {
            console.error('Error fetching journey plans:', error.response || error);
        }
    };

    // In your JourneyPlans.js component
    const addJourneyPlan = async () => {
        try {
        const token = localStorage.getItem('token'); // Get stored token
        await axios.post('http://localhost:5000/api/journeyPlans', {
            journey_plan_name,
            journey_plan_locations,
            start_date,
            end_date,
            list_of_activities: list_of_activities 
                ? list_of_activities.split(',').map(item => item.trim()).filter(Boolean)
                    : [], 
            description,
        }, {
            headers: {
            'Authorization': `Bearer ${token}` // Add this header
            }
        });
        fetchJourneyPlans();
        } catch (error) {
        console.error('Error adding journey plan:', error);
        }
    };

    //Update a journey plan
    const updateJourneyPlan = async (id) => {
        try {
          const token = localStorage.getItem('token');
          
          const response = await axios.put(
            `http://localhost:5000/api/journeyPlans/${id}`,
            {
                journey_plan_name,
                journey_plan_locations,
                start_date,
                end_date,
                list_of_activities: list_of_activities
                ? list_of_activities.split(',').map(item => item.trim()).filter(Boolean)
                : [],
                description,
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
      
          fetchJourneyPlans(); // Refresh the list after successful update
          return response.data;
        } catch (error) {
          console.error('Error updating journey plan:', error);
          
          // Handle specific error cases
          if (error.response) {
            if (error.response.status === 401) {
              alert('Session expired. Please log in again.');
              // Optionally redirect to login
              // window.location.href = '/login';
            } else if (error.response.status === 403) {
              alert('You do not have permission to update this journey plan.');
            } else if (error.response.status === 404) {
              alert('journey plan not found.');
            } else {
              alert('An error occurred while updating the journey plan.');
            }
          } else {
            alert('Network error. Please check your connection.');
          }
          
          throw error; // Re-throw the error if you want to handle it in the calling component
        }
      };
    

    //delete a journey plan
    const deleteJourneyPlan = async(id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/journeyPlans/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchJourneyPlans();
        } catch (error) {
            console.error('Error deleting journey plan:', error);
        }
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
                    placeholder="List Of Activities (Comma separated)"
                    value={list_of_activities}
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
                        {journey_plan.list_of_activities && (
                            <div className="activities-section">
                            <h4>List of Activities:</h4>
                            <ul className='activities-list'>
                                {(Array.isArray(journey_plan.list_of_activities) 
                                ? journey_plan.list_of_activities.map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                ))
                                : journey_plan.list_of_activities.split(',').map((activity, 
                                    index) => (
                                        <li key={index}>{activity.trim()}</li>
                                    )
                                ))
                            }
                                    
                            </ul>
                        
                            </div>
                        )}               
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