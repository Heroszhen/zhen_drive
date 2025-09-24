import React, { useRef } from 'react';

const DraggableField = ({ children }) => {
    const grayField = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        grayField.current.classList.remove('d-none');
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e) => {
        e.preventDefault();
        console.log(e.dataTransfer.items[0].webkitGetAsEntry())
        grayField.current.classList.add('d-none');
    }

    const handleDragLeave = (e) => {
        e.preventDefault();
        if (e.target == grayField.current)grayField.current.classList.add('d-none');
    }

    return (
        <section 
            className="draggable-zone relative" 
            draggable="true"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
        >
            {children}

            <div className="w-100 h-100 absolute z-[9999] top-0 start-0 bg-gray-500/50 d-none" ref={grayField}></div>
        </section>
    );
}
export default DraggableField;