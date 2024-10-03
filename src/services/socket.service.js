import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Handle incoming messages
socket.on('initial', (data) => {
    // Initialize state with data.admins
});

socket.on('adminsAvailability', (data) => {
    // Update the UI with availability status
});

// Send a request consultation
function requestConsultation(userId) {
    socket.emit('requestConsultation', userId);
}

// Update admin availability
function changeAdminAvailability(adminId, isAvailable) {
    socket.emit('updateAdminAvailability', { adminId, isAvailable });
}
