import React from 'react';
import './settings.component.css';

function Settings({ onClose }){
    return (
        <div className='overlay'>
            
            <div className='settings-dialog'>
                <button onClick={onClose} className='close-button'>X</button>
                <div className='rotated-text'>Settings</div>
                <div className='settings-body'>
                    
                    <div className='settings-header'>
                        
                        <h2>Notification Settings</h2>
                    </div>
                
                    <div className='settings-content'>
                        <div className='Daily-Reminder-Time'>
                            <label>Daily Reminder Time</label>
                            <div className='time-display'>  
                                <label className='hour-display'>08</label>
                                <label className='colon-display'>:</label>
                                <label className='minute-display'>00</label>
                                <label> </label>
                                <label className='AM-or-PM'> AM</label>
                            </div>
                            
                            
                        </div>
                        <div className='Days-to-Remind'>
                            <div>Days to Remind</div>
                            <div className='remind-days-buttons'>
                                {['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].map((days) => (
                                    <button key={days} className='day-button'>{days}</button>
                                ))} 
                            </div>
                        </div>
                    </div>
                </div>    
                
            </div>
        </div>
    )
}

export default Settings