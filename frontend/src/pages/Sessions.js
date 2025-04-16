import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sessions = () => {
    const[sessions,setSessions] = useState([]);
    const[therapistId,setTherapistId] = useState('');
    const[clientId, setClientId]=useState('');
    const[notes, setNotes]=useState('');
    const[date,setDate]=useState('');
    const[length,setLength]=useState('');


    //fetch all sessions
    const fetchSessions = async () => {
        try{ 
            const response = await axios.get('http://localhost:5000/api/sessions');
            setSessions(response.data);
        } catch(error) {
            console.error('Error fetching session: ',error);
        } 
    };
    

    //add a new session
    const addSession = async () => {
        try {
            await axios.post('http://localhost:5000/api/sessions', {
                therapist_id: Number(therapistId),
                client_id: Number(clientId),
                notes,
                date: new Date(date).toISOString().split('T')[0],
                length: Number(length),
            })
            fetchSessions(); //refresh the list
    
            setTherapistId('');
            setClientId('');
            setNotes('');
            setDate('');
            setLength('');
        } catch(error) {
            console.error('Error adding session:',error.response?.data||error.message);
        }    
    };

    //Update a session
    const updateSession = async (id) => {
        try{
            await axios.put(`http://localhost:5000/api/sessions/${id}`, {
                therapist_id: Number(therapistId),
                client_id: Number(clientId),
                notes,
                date: new Date(date).toISOString().split('T')[0],
                length: Number(length),
            });
            fetchSessions(); //refresh the list
        } catch(error) {
            console.error('Error updating session:',error.response?.data||error.message);
        }
    };

    //delete session
    const deleteSession = async(id)=> {
        await axios.delete(`http://localhost:5000/api/sessions/${id}`);
        fetchSessions();
    };

    useEffect(()=>{
        fetchSessions();
    },[]);

    return (
        <div>
            <h1 className='title'>Sessions</h1>
            <div className='input-grid'>
                <input
                    type="number"
                    placeholder="Therapist ID"
                    value={therapistId}
                    onChange={(e)=>setTherapistId(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Client ID"
                    value={clientId}
                    onChange={(e)=>setClientId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Notes"
                    value={notes}
                    onChange={(e)=>setNotes(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Length (minutes)"
                    value={length}
                    onChange={(e)=>setLength(e.target.value)}
                />
                <button onClick={addSession}>Add Session</button>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Therapist ID</th>
                        <th>Client ID</th>
                        <th>Notes</th>
                        <th>Date</th>
                        <th>Length</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session)=>(
                        <tr key = {session.id}>
                            <td>{session.therapist_id}</td>
                            <td>{session.client_id}</td>
                            <td>{session.notes}</td>
                            <td>{session.date}</td>
                            <td>{session.length}</td>
                            <td>
                                <button className='update-button' onClick={()=> updateSession(session.id)}>Update</button>
                                <button className='delete-button' onClick={()=> deleteSession(session.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sessions;