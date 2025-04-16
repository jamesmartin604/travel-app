import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; //imports css

const Therapists = () => {
    const [therapist, setTherapist] = useState([]);
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [location,setLocation] = useState('');
    const [yearsOfPractise,setYearsOfPractise] = useState(0);
    const [availability,setAvailability] = useState('TAKING CLIENTS');

    //Fetch all therapists
    const fetchTherapists = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/therapists');
            setTherapist(response.data);
        } catch (error) {
            console.error('Error fetching therapist',error);
        }

    };

    //Add a new therapist
    const addTherapist = async () => {
        await axios.post('http://localhost:5000/api/therapists', {
            title,
            name,
            email,
            location,
            years_of_practise: yearsOfPractise,
            availability,
        });
        fetchTherapists(); //refresh the list
    };

    //Update a therapist
    const updateTherapist = async (id) => {
        await axios.put(`http://localhost:5000/api/therapists/${id}`, {
            title,
            name,
            email,
            location,
            years_of_practise: yearsOfPractise,
            availability,
        });
        fetchTherapists(); //refresh the list
    };

    //delete a therapist
    const deleteTherapist = async (id) => {
        await axios.delete(`http://localhost:5000/api/therapists/${id}`);
        fetchTherapists(); //refresh the list
    };

    useEffect(()=>{
        fetchTherapists();
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
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e)=>setLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Years of Practise"
                    value={yearsOfPractise}
                    onChange={(e)=>setYearsOfPractise(e.target.value)}
                />
                <select
                    value={availability}
                    onChange={(e)=> setAvailability(e.target.value)}
                >
                    <option value="TAKING CLIENTS">Taking Clients</option>
                    <option value="NOT TAKING CLIENTS">Not Taking Clients</option>
                </select>
                
                <button onClick={addTherapist}>Add Therapist</button>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Years of Practise</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {therapist.map((therapist)=>(
                        <tr key = {therapist.id}>
                            <td>{therapist.name}</td>
                            <td>{therapist.title}</td>
                            <td>{therapist.email}</td>
                            <td>{therapist.location}</td>
                            <td>{therapist.years_of_practise}</td>
                            <td>{therapist.availability}</td>
                            <td>
                                <button className='update-button' onClick={()=> updateTherapist(therapist.id)}>Update</button>
                                <button className='delete-button' onClick={()=> deleteTherapist(therapist.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>       
    );
};


export default Therapists;