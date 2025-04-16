import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JourneyPlans = () => {
    const[journey_plans,setJourneyPlans]=useState([]);
    const[journey_plan_name,setJourneyPlanName]=useState('');
    const[journey_plan_locations,setJourneyPlanLocation]=useState('');
    const[start_date,setStartDate]=useState('');
    const[end_date,setEndDate]=useState('');
    const[list_of_activites,setListOfActivities]=useState('');
    const[description,setDescription]=useState('');

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
    
    useEffect(()=> {
        fetchJourneyPlans();
    },[]);

    return (
        <div>
            <h1 className='title'>Journey Plans</h1>
            <div className='input-grid'>
                <input
                    type="text"
                    placeholder="Journey Plan Name"
                    value={journey_plan_name}
                    onChange={(e)=>setJourneyPlanName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Journey Plan Location"
                    value={journey_plan_locations}
                    onChange={(e)=>setJourneyPlanLocation(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={start_date}
                    onChange={(e)=>setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={end_date}
                    onChange={(e)=>setEndDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="List Of Activities"
                    value={list_of_activites}
                    onChange={(e)=>setListOfActivities(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />
               
                <button onClick={addJourneyPlan}>Add Journey Plan</button>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Journey Plan Name</th>
                        <th>Journey Plan Location</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>List Of Activities</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {journey_plans.map((journey_plan)=>(
                        <tr key = {journey_plan.id}>
                            <td>{journey_plan.journey_plan_name}</td>
                            <td>{journey_plan.journey_plan_location}</td>
                            <td>{journey_plan.start_date}</td>
                            <td>{journey_plan.end_date}</td>
                            <td>{journey_plan.list_of_activites}</td>
                            <td>{journey_plan.description}</td>
                            <td>
                                <button className='update-button' onClick={()=> updateJourneyPlan(journey_plan.id)}>Update</button>
                                <button className='delete-button' onClick={()=> deleteJourneyPlan(journey_plan.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JourneyPlans;