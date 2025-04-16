import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clients = () => {
    const[clients,setClients]=useState([]);
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[phone,setPhone]=useState('');
    const[regularity,setRegularity]=useState('WEEKLY');

    //fetch all clients
    const fetchClients = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/clients');
            console.log('Response:',response.data); //log the response for debugging
            setClients(response.data);
        } catch (error) {
            console.error('erorr fetching clients:',error.response || error);
        }

    };

    //add a new client
    const addClient = async () => {
        await axios.post('http://localhost:5000/api/clients', {
            name,
            email,
            phone,
            regularity,
        });
        fetchClients(); //refresh the list
    };

    //Update a client
    const updateClient = async (id) => {
        await axios.put(`http://localhost:5000/api/clients/${id}`, {
            name,
            email,
            phone,
            regularity,
        });
        fetchClients(); //refresh the list
    };
    

    //delete a client
    const deleteClient = async(id)=>{
        await axios.delete(`http://localhost:5000/api/clients/${id}`);
        fetchClients(); //refresh the list
    };
    
    useEffect(()=> {
        fetchClients();
    },[]);

    return (
        <div>
            <h1 className='title'>Clients</h1>
            <div className='input-grid'>
                <input
                    type="text"
                    placeholder="Client Name"
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
                    placeholder="Phone"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                />
                <select
                    value={regularity}
                    onChange={(e)=>setRegularity(e.target.value)}
                >
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                </select>
               
                <button onClick={addClient}>Add Client</button>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Regularity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client)=>(
                        <tr key = {client.id}>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{client.phone}</td>
                            <td>{client.regularity}</td>
                            <td>
                                <button className='update-button' onClick={()=> updateClient(client.id)}>Update</button>
                                <button className='delete-button' onClick={()=> deleteClient(client.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Clients;