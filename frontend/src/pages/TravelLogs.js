import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../TravelLog.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

const TravelLogs = () => {
    const [travellogs, setTravelLog] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [post_date, setPostDate] = useState('');
    const [tags, setTags] = useState('');

    // Date formatting function
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    // Fetch all travel logs
    const fetchTravelLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/travelLogs');
            setTravelLog(response.data);
        } catch (error) {
            console.error('Error fetching TravelLogs', error);
        }
    };

    // Add a new travel log
    const addTravelLog = async () => {
        await axios.post('http://localhost:5000/api/travelLogs', {
            title,
            description,
            start_date,
            end_date,
            post_date,
            tags,
        });
        fetchTravelLogs();
    };

    // Update a travel log
    const updateTravelLog = async (id) => {
        await axios.put(`http://localhost:5000/api/travelLogs/${id}`, {
            title,
            description,
            start_date,
            end_date,
            post_date,
            tags,
        });
        fetchTravelLogs();
    };

    // Delete a travel log
    const deleteTravelLog = async (id) => {
        await axios.delete(`http://localhost:5000/api/travelLogs/${id}`);
        fetchTravelLogs();
    };

    useEffect(() => {
        fetchTravelLogs();
    }, []);

    return (
        <div className="travel-logs-container">
            <h1 className='title'>Your Travel Logs</h1>
            <p className='travellog-desc'>Revisit your past adventures and cherished memories</p>

            <div className='travel-log-form'>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="date-input-group">
                    <FaRegCalendarAlt className="calendar-icon" />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={start_date}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="date-input-group">
                    <FaRegCalendarAlt className="calendar-icon" />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={end_date}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="date-input-group">
                    <FaRegCalendarAlt className="calendar-icon" />
                    <input
                        type="date"
                        placeholder="Post Date"
                        value={post_date}
                        onChange={(e) => setPostDate(e.target.value)}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <button onClick={addTravelLog}>Add Travel Log</button>
            </div>

            <div className="travel-logs-grid">
                {travellogs.map((travellog) => (
                    <div key={travellog.id} className="travel-log-card">
                        <div className="card-header">
                            <h2>{travellog.title}</h2>
                            <div className="date-range">
                                <span>{formatDate(travellog.start_date)}</span>
                                <span> to </span>
                                <span>{formatDate(travellog.end_date)}</span>
                            </div>
                            <div className="post-date">
                                Posted on: {formatDate(travellog.post_date)}
                            </div>
                        </div>
                        <div className="card-body">
                            <p>{travellog.description}</p>
                        </div>
                        <div className="card-footer">
                            <div className="tags">
                                {travellog.tags && travellog.tags.split(',').map((tag, index) => (
                                    <span key={index} className="tag">{tag.trim()}</span>
                                ))}
                            </div>
                            <div className="card-actions">
                                <button className='update-button' onClick={() => updateTravelLog(travellog.id)}>Update</button>
                                <button className='delete-button' onClick={() => deleteTravelLog(travellog.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TravelLogs;