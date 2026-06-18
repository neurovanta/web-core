import React from 'react';

const Welcome = () => {
  return (
    <div className=" h-screen w-full flex justify-center items-center flex-col">
      <p className="text-xl font-bold text-gray-800 mb-2">
        Welcome to the Neuro Vanta Dashboard
      </p>
      <p className="text-gray-600">
        Use this dashboard to manage and update your website content.
      </p>
    </div>
  );
};

export default Welcome;