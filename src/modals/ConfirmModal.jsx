import React from 'react';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onCancel}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <p>{message}</p>
                <div style={styles.buttonContainer}>
                    <button onClick={onConfirm} style={styles.confirmButton}>Yes</button>
                    <button onClick={onCancel} style={styles.cancelButton}>No</button>
                </div>
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
    buttonContainer: {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    confirmButton: {
        padding: '8px 16px',
        backgroundColor: '#ff6423',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    cancelButton: {
        padding: '8px 16px',
        backgroundColor: '#ff6423',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};
