import React from 'react';

export default function MessageModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <p>{message}</p>
                <button onClick={onClose} style={styles.button}>Close</button>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        background: '#fff',
        padding: '20px 30px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    button: {
        marginTop: '15px',
        padding: '8px 16px',
        backgroundColor: '#ff6423',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};
