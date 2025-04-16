import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; //imports css

const TravelLogs = () => {
    const [travellogs, setTravelLog] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date,setStartDate] = useState('');
    const [end_date,setEndDate] = useState('');
    const [post_date,setPostDate] = useState('');
    const [tags,setTags] = useState('');

    //Fetch all travel logs
    const fetchTravelLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/travelLogs');
            setTravelLog(response.data);
        } catch (error) {
            console.error('Error fetching TravelLogs',error);
        }

    };

    //Add a new therapist
    const addTravelLog = async () => {
        await axios.post('http://localhost:5000/api/travelLogs', {
            title,
            description,
            start_date,
            end_date,
            post_date,
            tags,
        });
        fetchTravelLogs(); //refresh the list
    };

    //Update a travel log
    const updateTravelLog = async (id) => {
        await axios.put(`http://localhost:5000/api/travelLogs/${id}`, {
            title,
            description,
            start_date,
            end_date,
            post_date,
            tags,
        });
        fetchTravelLogs(); //refresh the list
    };

    //delete a travel log
    const deleteTravelLog = async (id) => {
        await axios.delete(`http://localhost:5000/api/travelLogs/${id}`);
        fetchTravelLogs(); //refresh the list
    };

    useEffect(()=>{
        fetchTravelLogs();
    },[]);

    return (
        <div>
            <h1 className='title'>Your Travel Logs</h1>
            <p className='travellog-desc'>Revisit your past adventures and cherished memories</p>

            <div className='input-grid'>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
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
                    type="date"
                    placeholder="Post Date"
                    value={post_date}
                    onChange={(e)=>setPostDate(e.target.value)}
                />
               <input
                    type="text"
                    placeholder="Tags"
                    value={tags}
                    onChange={(e)=>setTags(e.target.value)}
                />
                
                <button onClick={addTravelLog}>Add Travel Log</button>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Post Date</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {travellogs.map((travellog)=>(
                        <tr key = {travellog.id}>
                            <td>{travellog.name}</td>
                            <td>{travellog.description}</td>
                            <td>{travellog.start_date}</td>
                            <td>{travellog.end_date}</td>
                            <td>{travellog.post_date}</td>
                            <td>{travellog.tags}</td>
                            <td>
                                <button className='update-button' onClick={()=> updateTravelLog(travellog.id)}>Update</button>
                                <button className='delete-button' onClick={()=> deleteTravelLog(travellog.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>       
    );
};


export default TravelLogs;